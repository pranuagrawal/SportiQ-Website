package com.itv.sport.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itv.sport.model.Cart;
import com.itv.sport.service.CartService;

@RestController
@RequestMapping("/api/cart")
//@CrossOrigin(origins = "http://localhost:5182")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get cart items for a given user (pass userId as query parameter)
    @GetMapping
    public List<Cart> getCartItems(@RequestParam Long userId) {
        return cartService.getCartItemsByUser(userId);
    }

    // Add to cart (userId from query param, bookId from path, quantity from query param)
    @PostMapping("/add/{productId}")
    public Cart addToCart(
        @PathVariable Long productId,
        @RequestParam int quantity,
        @RequestParam Long userId  // <-- Make sure this matches the query param
    ) {
        return cartService.addToCart(userId, productId, quantity);
    }

    // Increase quantity of a cart item
    @PutMapping("/increase/{cartItemId}")
    public Cart increaseQuantity(@PathVariable Long cartItemId) {
        return cartService.increaseQuantity(cartItemId);
    }

    // Decrease quantity of a cart item
    @PutMapping("/decrease/{cartItemId}")
    public void decreaseQuantity(@PathVariable Long cartItemId) {
        cartService.decreaseQuantity(cartItemId);
    }

    // Remove a cart item
    @DeleteMapping("/remove/{cartItemId}")
    public void removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
    }

    // Clear cart for a specific user
    @DeleteMapping("/clear")
    public void clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
    }
}
