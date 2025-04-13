package com.itv.sport.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "cart")
@Getter
@Setter
@AllArgsConstructor
@ToString
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Number of copies of this product in the cart
    private int quantity;

    // User ID to associate cart with a specific user
    private Long userId;

    public Cart() {}

    public Cart(Product product, int quantity, Long userId) {
        this.product = product;
        this.quantity = quantity;
        this.userId = userId;
    }

}
