package com.DevConnect.devconnect.Controllers;

import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Services.UserService;
import com.DevConnect.devconnect.Utils.APIReturnModel;
import com.DevConnect.devconnect.Utils.StoryDTO;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@CrossOrigin(origins = "*")
@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserService userService;
    
    private APIReturnModel apiReturnModel;
	private Vector<UserModel> userVec;

    @GetMapping("/test")
    public String test() {
        return "hello devconnect";
    }

    // 1. siginging in and registration
    @PostMapping("/register")
    public ResponseEntity<?> regisetrUser(@RequestBody UserModel usermodel) {
        apiReturnModel = new APIReturnModel();
        userVec = new Vector<>();

        try{
            UserModel user = this.userService.createUser(usermodel);
            userVec.add(user);

            apiReturnModel.setData(userVec);
			apiReturnModel.setStatus("Success");
			apiReturnModel.setMessage("User Created Successfully !");
			apiReturnModel.setCount(userVec.size());
        }catch(Exception e){
            e.printStackTrace();
			apiReturnModel.setStatus("Fail");
			apiReturnModel.setMessage(" Send the correct  User Data");
			apiReturnModel.setCount(0);
        }

        return ResponseEntity.ok(apiReturnModel);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam("username") String username, @RequestParam("password") String password) {
        apiReturnModel = new APIReturnModel();
        userVec = new Vector<>();
        // System.err.println(username);
        try{
            UserModel user = this.userService.loginUser(username, password);
            if(user == null){
                apiReturnModel.setStatus("Fail");
                apiReturnModel.setMessage(" Username or Password is incorrect");
                apiReturnModel.setCount(0);
                return ResponseEntity.ok(apiReturnModel);
            }
            userVec.add(user);

            apiReturnModel.setData(userVec);
            apiReturnModel.setStatus("Success");
            apiReturnModel.setMessage("User Logged In Successfully !");
            apiReturnModel.setCount(userVec.size());
        }catch (Exception e){
            e.printStackTrace();
            apiReturnModel.setStatus("Fail");
            apiReturnModel.setMessage(" Username or Password is incorrect");
            apiReturnModel.setCount(0);
        }

        return ResponseEntity.ok(apiReturnModel);
    }

    @GetMapping("/{username}")
    public UserModel getsUserbyUsername(@PathVariable("username") String username) {
        try{
            UserModel user = this.userService.findByUsername(username);
            return user;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    // 2. following and unfollwing other users
    @PostMapping("/{userId}/follow/{followeeId}")
    public String followUser(@PathVariable long userId, @PathVariable long followeeId) {
        userService.followUser(userId, followeeId);

        return "Started following user";
    }

    @PostMapping("/{userId}/unfollow/{followeeId}")
    public String unfollowUser(@PathVariable long userId, @PathVariable long followeeId) {
        userService.unfollowUser(userId, followeeId);

        return "Stopped following user";
    }

    @GetMapping("/{userId}/followers")
    public Iterable<UserModel> getFollowers(@PathVariable long userId) {
        return userService.getFollowers(userId);
    }

    @GetMapping("/{userId}/following")
    public Iterable<UserModel> getFollowing(@PathVariable long userId) {
        return userService.getFollowing(userId);
    }

    @DeleteMapping("/delete-story/{userId}")
    public UserModel deleteStory(@PathVariable("userId") Long userId){
        // check if the given id user is having not null story...if yes then make it null(delete it)....if already null then state that
        return this.userService.deleteStory(userId);
    }

    @PostMapping("/set-story")
    public UserModel setStory(@RequestParam("storyUrl") String storyUrl, @RequestParam("userId") Long userId) {
        System.out.println(storyUrl);
        return this.userService.setStory(userId, storyUrl);
    }
    
    @GetMapping("/get-stories/{userId}")
    public Iterable<StoryDTO> getStroiesOfUserAndFollowing(@PathVariable("userId") Long userId) { //gets and returns stories of all the users and the following
        return this.userService.getStories(userId);
    }

    @GetMapping("/users-of-similar-usernames/{username}") 
    public Iterable<UserModel> getSimilarUsenameUsers(@PathVariable("username") String username) {
        return this.userService.getSimilarUsernameUsers(username);
    }
    
    

    // @GetMapping("/homepage")
    // public UserModel getHomePage() {
    //     return userService.findByUsername("homepage");
    // }
}
