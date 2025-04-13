package com.itv.sport.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.itv.sport.model.MyOrder;
import com.itv.sport.model.OrderItem;
import com.itv.sport.model.Product;
import com.itv.sport.repository.MyOrderRepository;
import com.itv.sport.repository.ProductRepository;
import com.itv.sport.service.MyOrderService;
import org.springframework.transaction.annotation.Transactional;

//@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/order")
public class MyOrderController {

    @Autowired
    private MyOrderService orderService;

    @Autowired
    ProductRepository productRepository;
    
    @Autowired
    private MyOrderRepository orderRepository;

//    @PostMapping("/createorder")
//    public ResponseEntity<MyOrder> placeOrder(@RequestBody MyOrder myorder) {
//        MyOrder savedOrder = orderService.placeMyOrder(myorder);
//        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
//    }

    @PostMapping("/createorder")
    public ResponseEntity<?> placeOrder(@RequestBody MyOrder myorder) {
        if (myorder.getUser() == null) {
            return ResponseEntity.badRequest().body("User information is missing");
        }
        
        if (myorder.getAddress() == null || myorder.getAddress().isEmpty()) {
            return ResponseEntity.badRequest().body("Address is missing in the order payload.");
        }
        
        System.out.println("Order received: " + myorder);
        MyOrder savedOrder = orderService.placeMyOrder(myorder);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @GetMapping
    public ResponseEntity<?> getOrdersByUser(@RequestParam(required = false) Long userId,
                                             @RequestParam(required = false) String status) {
        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        List<MyOrder> orders = (status != null) ? orderRepository.findByUserIdAndStatus(userId, status)
                                                : orderRepository.findByUserId(userId);

        return ResponseEntity.ok(orders);
    }


    @GetMapping("/all")
    public List<MyOrder> getAllOrders() {
        return orderService.getAllMyOrders();
    }

//    @PutMapping("/{orderId}/status")
//    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
//        String status = request.get("status");
//        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
//    }
   

    @PutMapping("/{orderId}/status")
    @Transactional // Ensures atomic updates
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        System.out.println("Received update request: " + request);

        if (!request.containsKey("status")) {
            return ResponseEntity.badRequest().body("Status field is missing");
        }

        String newStatus = request.get("status");
        Optional<MyOrder> optionalOrder = orderRepository.findById(orderId);

        if (!optionalOrder.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        MyOrder order = optionalOrder.get();

        if ("Delivered".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot change delivered order back to pending.");
        }

        // Update stock only if moving to Delivered
        if ("Delivered".equals(newStatus)) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    if (product != null) {
                        if (product.getStock() < item.getQuantity()) {
                            return ResponseEntity.badRequest().body("Not enough stock for " + product.getName());
                        }
                        product.setStock(product.getStock() - item.getQuantity());
                        productRepository.save(product);
                    }
                }
            }
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated to " + newStatus);
    }

    @GetMapping("/status")
    public ResponseEntity<List<MyOrder>> getOrdersByStatus(@RequestParam String status) {
        List<MyOrder> orders = orderRepository.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getOrderStats() {
        long pendingOrders = orderRepository.countByStatus("Pending");
        long completedOrders = orderRepository.countByStatus("Delivered");
        long totalOrders = orderRepository.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", pendingOrders);
        stats.put("delivered", completedOrders);
        stats.put("total", totalOrders);

        return ResponseEntity.ok(stats);
    }
}