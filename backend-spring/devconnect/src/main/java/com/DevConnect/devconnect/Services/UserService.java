package com.DevConnect.devconnect.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserModel createUser(UserModel newUser){
        return userRepository.save(newUser);
    }

    public UserModel findByUsername(String username) {
        return userRepository.getUserByUsername(username);
    }


    public UserModel loginUser(String username, String password) {
        return userRepository.getUserByUsernameAndPassword(username, password);
    }
}
