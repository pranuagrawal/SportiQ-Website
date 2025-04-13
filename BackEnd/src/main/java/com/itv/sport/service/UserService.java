package com.itv.sport.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itv.sport.model.User;
import com.itv.sport.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public List<User> getAllUsers() {
        return userRepository.findByRole("USER");
    }
	
	public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

}
