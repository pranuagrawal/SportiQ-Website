package com.itv.sport.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.itv.sport.model.Product;
import com.itv.sport.repository.ProductRepository;
import com.itv.sport.service.ProductService;

//@CrossOrigin(origins = "http://localhost:5182")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) {
        Optional<Product> productOptional = productService.getProduct(productId);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            if (product.getImage() != null && !product.getImage().isEmpty()) {
                product.setImage("http://localhost:8024/" + product.getImage());
            }

            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        List<Product> products = productService.getAllProducts();

        for (Product product : products) {
            if (product.getImage() != null && !product.getImage().isEmpty()) {
                product.setImage("http://localhost:8024/" + product.getImage());
            }
        }

        return products;
    }
    
    @GetMapping("/count")
    public long getProductCount() {
        return productService.getProductCount();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
        @RequestParam("name") String name,
        @RequestParam("price") Double price,
        @RequestParam("category") String category,
        @RequestParam("description") String description,
        @RequestParam("stock") Integer stock,
        @RequestParam("image") MultipartFile image
    ) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            Files.write(filePath, image.getBytes());

            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setCategory(category);
            product.setDescription(description);
            product.setImage(fileName);
            product.setStock(stock);

            return ResponseEntity.ok(productService.addProduct(product));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving image: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy) {
        
        List<Product> products = productService.searchProducts(name, category,sortBy);

        for (Product product : products) {
            if (product.getImage() != null && !product.getImage().isEmpty()) {
                product.setImage("http://localhost:8024/" + product.getImage());
            }
        }

        return products;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Optional<Product> optionalProduct = productService.getProductById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(name);
            product.setPrice(price);
            product.setCategory(category);
            product.setDescription(description);
            product.setStock(stock);

            // Handle new image upload
            if (image != null && !image.isEmpty()) {
                try {
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.write(filePath, image.getBytes());
                    product.setImage(fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Error saving image: " + e.getMessage());
                }
            }

            productService.addProduct(product);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok("Product deleted successfully!");
        } else {
            return ResponseEntity.status(404).body("Product not found!");
        }
    }

    @PutMapping("/updateStock/{productId}/{quantity}")
    public ResponseEntity<String> updateStock(@PathVariable Long productId, @PathVariable int quantity) {
        Optional<Product> productOptional = productService.getProductById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setStock(quantity);
            productService.addProduct(product);
            return ResponseEntity.ok("Stock updated successfully!");
        } else {
            return ResponseEntity.status(404).body("Product not found!");
        }
    }
    
    @PutMapping("/updatePrice/{productId}/{newPrice}")
    public ResponseEntity<String> updatePrice(@PathVariable Long productId, @PathVariable double newPrice) {
        boolean success = productService.updatePrice(productId, newPrice);
        if (success) {
            return ResponseEntity.ok("Price updated successfully!");
        } else {
            return ResponseEntity.badRequest().body("Product not found or invalid price value.");
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getDistinctCategories() {
        List<String> categories = productRepository.findDistinctCategories();
        return ResponseEntity.ok(categories);
    }
}
