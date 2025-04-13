package com.itv.sport.service;

import com.itv.sport.model.Cart;
import com.itv.sport.model.Product;
import com.itv.sport.repository.CartRepository;
import com.itv.sport.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get all cart items for a specific user
    public List<Cart> getCartItemsByUser(Long userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        // Ensure product details (including image) are initialized
        for (Cart cart : cartItems) {
            cart.getProduct().getName();  // Forces Hibernate to fetch product details
            cart.getProduct().getImage(); // Ensures image URL is available
        }

        return cartItems;
    }


    // Add a book to the user's cart (increase quantity if already exists)
    public Cart addToCart(Long userId, Long productId, int quantityToAdd) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if user already has the book in the cart
        List<Cart> userCart = cartRepository.findByUserId(userId);
        for (Cart cartItem : userCart) {
            if (cartItem.getProduct().getId().equals(productId)) {
                int newQuantity = Math.min(cartItem.getQuantity() + quantityToAdd, product.getStock());
                cartItem.setQuantity(newQuantity);
                return cartRepository.save(cartItem);
            }
        }

        // If not found, create a new Cart item
        int initialQuantity = Math.min(quantityToAdd, product.getStock());
        Cart newCartItem = new Cart(product, initialQuantity, userId); // <-- Pass userId here
        return cartRepository.save(newCartItem);
    }


    // Increase quantity of a cart item
    public Cart increaseQuantity(Long cartItemId) {
        Cart cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        Product product = cartItem.getProduct();
        if (cartItem.getQuantity() < product.getStock()) {
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            return cartRepository.save(cartItem);
        } else {
            throw new RuntimeException("Cannot exceed available stock");
        }
    }

    // Decrease quantity of a cart item (remove if quantity becomes 0)
    public void decreaseQuantity(Long cartItemId) {
        Cart cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        int newQuantity = cartItem.getQuantity() - 1;
        if (newQuantity > 0) {
            cartItem.setQuantity(newQuantity);
            cartRepository.save(cartItem);
        } else {
            cartRepository.deleteById(cartItemId);
        }
    }
    
    

    // Remove a cart item completely
    public void removeCartItem(Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }

    // Clear the cart for a specific user
    public void clearCart(Long userId) {
        List<Cart> userCart = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(userCart);
    }
}
