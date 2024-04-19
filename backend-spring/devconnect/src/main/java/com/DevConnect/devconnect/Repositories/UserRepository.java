package com.DevConnect.devconnect.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.DevConnect.devconnect.Models.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long> {
	UserModel getUserByUsername(String username);
	UserModel getUserByUsernameAndPassword(String username, String password);
}