package com.DevConnect.devconnect.Services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.AuthenticationResponse;
import com.DevConnect.devconnect.Models.Role;
import com.DevConnect.devconnect.Models.Token;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.TokenRepository;
import com.DevConnect.devconnect.Repositories.UserRepository;

// import java.util.Collections;
import java.util.List;
// import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final TokenRepository tokenRepository;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 TokenRepository tokenRepository,
                                 AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(UserModel request) {

        // check if user already exist. if exist than authenticate the user
        if(repository.getUserByUsername(request.getUsername()) != null) {
            return new AuthenticationResponse(null, "User already exist", null);
        }

        UserModel user = new UserModel();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar(request.getAvatar());
        user.setBio(request.getBio());
        user.setName(request.getName());
        user.setRole(request.getRole());

        user = repository.save(user);

        String jwt = jwtService.generateToken(user);

        saveUserToken(jwt, user);
        return new AuthenticationResponse(jwt, "User registration was successful", user);
    }

    public AuthenticationResponse authenticate(UserModel request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            )
        );

        UserModel user = repository.getUserByUsername(request.getUsername());
        String jwt = jwtService.generateToken(user);

        // System.out.println(user.getName());

        revokeAllTokenByUser(user);
        saveUserToken(jwt, user);

        // UserModel newUser = new UserModel();
        // newUser.setUsername(user.getUsername());
        // newUser.setEmail(user.getEmail());
        // newUser.setRole(user.getRole());
        // newUser.setId(user.getId());
        // user.setAvatar(request.getAvatar());
        // user.setBio(request.getBio());
        // user.setName(request.getName());
        // user.setRole(request.getRole());


        return new AuthenticationResponse(jwt, "User login was successful", user);

    }

    public AuthenticationResponse google(UserModel request) {
        if(repository.getUserByUsername(request.getUsername()) != null) {
            UserModel user = repository.getUserByUsername(request.getUsername());
            UserModel newUser = new UserModel();
            newUser.setUsername(user.getUsername());
            newUser.setEmail(user.getEmail());
            newUser.setRole(user.getRole());
            newUser.setAvatar(user.getAvatar());
            newUser.setBio(user.getBio());
            newUser.setName(user.getName());
            newUser.setRole(user.getRole());
            String jwt = jwtService.generateToken(newUser);
            saveUserToken(jwt, newUser);
            return new AuthenticationResponse(jwt, "User already exist", newUser);
        }

        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setAvatar(user.getAvatar());
        user.setBio(user.getBio());
        user.setName(user.getName());
        user.setRole(user.getRole());

        String generatedPassword =
                UUID.randomUUID().toString().substring(0, 8) +
                        UUID.randomUUID().toString().substring(0, 8);

        user.setPassword(passwordEncoder.encode(generatedPassword));


        user.setRole(request.getRole());

        user = repository.save(user);

        String jwt = jwtService.generateToken(user);

        saveUserToken(jwt, user);

        return new AuthenticationResponse(jwt, "User registration was successful", user);

    }

    public UserModel getUser(Long id) {
        return repository.findById(id).orElse(null);
    }

    private void revokeAllTokenByUser(UserModel user) {
        List<Token> validTokens = tokenRepository.findAllTokensByUser(user.getId());
        if(validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t-> {
            t.setLoggedOut(true);
        });

        tokenRepository.saveAll(validTokens);
    }
    private void saveUserToken(String jwt, UserModel user) {
        Token token = new Token();
        token.setToken(jwt);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

    public AuthenticationResponse logout(String token) {
        Token tokens = tokenRepository.findByToken(token).orElse(null);
        if(tokens == null) {
            return new AuthenticationResponse(null, "Token not found", null);
        }
        tokens.setLoggedOut(true);
        tokenRepository.save(tokens);
        return new AuthenticationResponse(null, "User logout was successful", null);
    }

    public AuthenticationResponse update(Long id, UserModel request) {
        UserModel user = repository.findById(id).orElse(null);
        if(user == null) {
            return new AuthenticationResponse(null, "User not found", null);
        }
        UserModel newUser = new UserModel();
        newUser.setEmail(request.getEmail());
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        // newUser.setPhoneNumber(request.getPhoneNumber());
        // newUser.setPhotoUrl(request.getPhotoUrl());
        newUser.setAvatar(request.getAvatar());
        newUser.setBio(request.getBio());
        newUser.setName(request.getName());
        newUser.setRole(request.getRole());
        newUser.setId(id);
        newUser.setRole(Role.valueOf("USER"));
        newUser = repository.save(newUser);
        String jwt = jwtService.generateToken(newUser);
        saveUserToken(jwt, newUser);
        return new AuthenticationResponse(jwt, "User update was successful", newUser);
    }
}

