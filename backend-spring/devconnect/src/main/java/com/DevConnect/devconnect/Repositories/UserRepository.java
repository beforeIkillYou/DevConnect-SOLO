package com.DevConnect.devconnect.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.DevConnect.devconnect.Models.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long> {
	UserModel getUserByUsername(String username);
	UserModel getUserByUsernameAndPassword(String username, String password);

	@Query("SELECT u FROM UserModel u WHERE u.username LIKE %:username%")
    List<UserModel> findByUsernameContaining(@Param("username") String username);
}