package com.itv.sport.model;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
    @NotNull(message = "Product Name cannot be null")
    private String name;
    
    @NotNull(message = "Price cannot be null") 
    @Column(precision = 10)
    private Double price;
   
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Category cannot be null")
    private String category;
    
    @NotNull(message = "Stock can not be null")
    private Integer stock;
    
    @NotNull(message = "Image cannot be null")
    private String image;
    
    // Relationship with Cart
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Cart> carts;
//
//    // Relationship with OrderItem
//    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<OrderItem> orderItems;
}
