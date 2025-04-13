package com.itv.sport.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itv.sport.model.User;
import com.itv.sport.service.UserService;

@RestController
@RequestMapping("/api/admin")
//@CrossOrigin(origins = "http://localhost:5182") // Allow frontend access
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
