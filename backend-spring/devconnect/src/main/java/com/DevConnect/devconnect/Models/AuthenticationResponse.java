package com.DevConnect.devconnect.Models;

public class AuthenticationResponse {
    private String token;
    private String message;

    private UserModel user;

    public AuthenticationResponse(String token, String message, UserModel user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public UserModel getUser() {
        return user;
    }
}
