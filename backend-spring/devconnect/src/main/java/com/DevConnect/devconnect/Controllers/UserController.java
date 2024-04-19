package com.DevConnect.devconnect.Controllers;

import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Services.UserService;
import com.DevConnect.devconnect.Utils.APIReturnModel;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
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
    public String getMethodName() {
        return "Final hello devconnect";
    }
    @PostMapping("/register")
    public ResponseEntity<?> postMethodName(@RequestBody UserModel usermodel) {
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
    public ResponseEntity<?> postMethodName(@RequestParam("username") String username, @RequestParam("password") String password) {
        apiReturnModel = new APIReturnModel();
        userVec = new Vector<>();
        // System.err.println(username);
        try{
            UserModel user = this.userService.loginUser(username, password);
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
}
