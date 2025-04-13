package com.itv.sport.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String username;
    
	@NotNull(message = "Mobile number cannot be null") 
	@NotEmpty(message = "Mobile number cannot be empty") 
	@Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be a 10-digit number") 
	@Column(unique = true)
	private String mobileno;

    @Column(nullable = false)
    private String role; // Can be "USER" or "ADMIN"

	
}
