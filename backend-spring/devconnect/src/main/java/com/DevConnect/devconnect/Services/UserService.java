package com.DevConnect.devconnect.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.DevConnect.devconnect.Models.Role;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.UserRepository;

import jakarta.transaction.Transactional;

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

    @Transactional
    public void followUser(long userId, long followeeId) {
        if (userId == followeeId) {
            throw new RuntimeException("You cannot follow yourself");
        }

        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserModel followee = userRepository.findById(followeeId).orElseThrow(() -> new RuntimeException("Followee not found"));
        
        // add only if user is not alreafy follwing
        if (!user.getFollowing().contains(followee)) {
            // Add followee to user's following list
           user.getFollowing().add(followee);
   
           // Add user to followee's followers list
           followee.getFollowers().add(user);
   
        }
        userRepository.save(user);
        userRepository.save(followee);
    }

    @Transactional
    public void unfollowUser(long userId, long followeeId) {
        if(userId == followeeId) {
            throw new RuntimeException("You cannot unfollow yourself");
        }

        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserModel followee = userRepository.findById(followeeId).orElseThrow(() -> new RuntimeException("Followee not found"));
        
        // Remove followee from user's following list
        user.getFollowing().remove(followee);

        // Remove user from followee's followers list
        followee.getFollowers().remove(user);

        // Save both user and followee
        userRepository.save(user);
        userRepository.save(followee);
    }

    public Iterable<UserModel> getFollowers(long userId) {
        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers();
    }

    public Iterable<UserModel> getFollowing(long userId) {
        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowing();
    }
}
