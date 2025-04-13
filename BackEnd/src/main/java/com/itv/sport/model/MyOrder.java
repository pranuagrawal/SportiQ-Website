package com.itv.sport.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "myorders")
public class MyOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private double totalPrice;

    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate = new Date(); // Automatically set to current date
    
    private String address; 
    private String paymentMethod;


    @OneToMany(mappedBy = "myorder", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>(); // Initialize list to avoid NullPointerException

    // Constructor
    public MyOrder(User user, double totalPrice, String status,String address, String paymentMethod) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.status = status;
        this.orderDate = new Date();
        this.address = address;
        this.paymentMethod = paymentMethod;
    }

    // Helper method to add items
    public void addOrderItem(OrderItem item) {
        item.setMyorder(this); 
        this.items.add(item);
    }

    // Helper method to remove an item
    public void removeOrderItem(OrderItem item) {
        this.items.remove(item);
        item.setMyorder(null); 
    }
}
