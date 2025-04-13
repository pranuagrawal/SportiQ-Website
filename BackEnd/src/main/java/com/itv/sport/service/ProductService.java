package com.itv.sport.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itv.sport.model.Product;
import com.itv.sport.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Add or update a product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by ID
    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    // Delete a product
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false; // Product not found
    }

    // Get a product (alternative method)
    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    // Search products by title and category
    public List<Product> searchProducts(String name, String category,String sortBy) {
    	
    	 List<Product> products;
    	 
        if (name != null && category != null) {
            products = productRepository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(name, category);
        } else if (name != null) {
            products =  productRepository.findByNameContainingIgnoreCase(name);
        } else if (category != null) {
            products =  productRepository.findByCategoryContainingIgnoreCase(category);
        } else {
            products =  productRepository.findAll();
        }
        
        if ("asc".equalsIgnoreCase(sortBy)) {
            products.sort((p1, p2) -> Double.compare(p1.getPrice(), p2.getPrice()));
        } else if ("desc".equalsIgnoreCase(sortBy)) {
            products.sort((p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
        }

        return products;
    }

    // Update stock after an order is placed
    public boolean updateStock(Long productId, int quantityOrdered) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            int newStock = product.getStock() - quantityOrdered;

            if (newStock >= 0) {
                product.setStock(newStock);
                productRepository.save(product);
                return true; // Stock updated successfully
            } else {
                return false; // Not enough stock
            }
        }
        return false; // Product not found
    }

    public boolean updatePrice(Long productId, double newPrice) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent() && newPrice >= 0) {
            Product product = productOpt.get();
            product.setPrice(newPrice);
            productRepository.save(product);
            return true;
        }
        return false;
    }
    
    public long getProductCount() {
        return productRepository.count();
    }
}