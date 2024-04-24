package com.DevConnect.devconnect.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.DevConnect.devconnect.Models.AuthenticationResponse;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Services.AuthenticationService;

@RestController
@CrossOrigin
@RequestMapping("/api/")
public class AuthenticationController {

    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }


    @PostMapping("register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody UserModel request
            ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody UserModel request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("google")
    public ResponseEntity<AuthenticationResponse> google(
            @RequestBody UserModel request
    ) {
        return ResponseEntity.ok(authService.google(request));
    }

    @GetMapping("logout")
    public AuthenticationResponse logout(
            @RequestHeader("Authorization") String token
    ) {
        return (authService.logout(token));
    }

    @PostMapping("update/{id}")
    public ResponseEntity<AuthenticationResponse> update(
            @PathVariable("id") Long id , @RequestBody UserModel request
    ) {
        return ResponseEntity.ok(authService.update(id, request));
    }

    @GetMapping("getUser/{id}")
    public ResponseEntity<UserModel> getUser(
            @PathVariable("id") Long id
    ) {
        return ResponseEntity.ok(authService.getUser(id));
    }

}
