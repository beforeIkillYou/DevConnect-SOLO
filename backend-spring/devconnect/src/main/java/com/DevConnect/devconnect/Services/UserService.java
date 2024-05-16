package com.DevConnect.devconnect.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.DevConnect.devconnect.Models.Role;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.UserRepository;
import com.DevConnect.devconnect.Utils.StoryDTO;

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

    public UserModel deleteStory(Long userId){
        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStory(null);
        return userRepository.save(user);
    }

    public UserModel setStory(Long userId, String story){
        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStory(story);
        return userRepository.save(user);
    }

    public Iterable<StoryDTO> getStories(long userId){
        //this function takes the current user id and returns a list of strings ....which are "story" urls of the current user and of the users the current user is following
        UserModel user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<StoryDTO> stories = new ArrayList<>();
        if(user.getStory() != null){
            StoryDTO storyDTO = new StoryDTO(user.getAvatar(),user.getStory(),user.getUsername());
            stories.add(storyDTO);
        }

        for(UserModel followee : user.getFollowing()){
            if(user.getStory() != null){
                StoryDTO storyDTO = new StoryDTO(followee.getAvatar(), followee.getStory(), followee.getUsername());
                stories.add(storyDTO);
            }   
        }
        return stories;
    }
    public Iterable<UserModel> getSimilarUsernameUsers(String username) {
        return userRepository.findByUsernameContaining(username);
    }
}
