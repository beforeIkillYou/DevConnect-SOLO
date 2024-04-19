package com.DevConnect.devconnect.Controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user")
public class UserController {

    @CrossOrigin
    @GetMapping("/test")
    public String test() {
        return "Hello World";
    }
}
