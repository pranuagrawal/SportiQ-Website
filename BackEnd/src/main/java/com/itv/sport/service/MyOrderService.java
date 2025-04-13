package com.itv.sport.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itv.sport.model.MyOrder;
import com.itv.sport.model.OrderItem;
import com.itv.sport.model.User;
import com.itv.sport.repository.MyOrderRepository;
import com.itv.sport.repository.ProductRepository;
import com.itv.sport.repository.UserRepository;

@Service
public class MyOrderService {

    @Autowired
    private MyOrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CartService cartService;

//    public MyOrder placeMyOrder(MyOrder order) {
//        // Fetch the user
//        User user = userRepository.findById(order.getUser().getId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Set the user and other required fields
//        order.setUser(user);
//        order.setStatus("Pending");
//        order.setOrderDate(new Date());
//
//        // Ensure each OrderItem has a reference to the Order
//        for (OrderItem item : order.getItems()) {
//            item.setMyorder(order); // Set the order reference in each item
//        }
//
//        // Save the order
//        return orderRepository.save(order);
//    }
    
    public MyOrder placeMyOrder(MyOrder order) {
        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new RuntimeException("User information is missing in the order");
        }

        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        order.setUser(user);
        order.setStatus("Pending");
        order.setOrderDate(new Date());
        
        if (order.getAddress() == null || order.getAddress().isEmpty()) {
            throw new RuntimeException("Address is required");
        }
        if (order.getPaymentMethod() == null || order.getPaymentMethod().isEmpty()) {
            throw new RuntimeException("Payment Method is required");
        }

        for (OrderItem item : order.getItems()) {
            item.setMyorder(order);
            item.setProduct(productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found")));

            item.setPrice(item.getProduct().getPrice());
        }

        MyOrder savedOrder = orderRepository.save(order);
        
        cartService.clearCart(user.getId());
        
        return savedOrder;
    }


	public List<MyOrder> getOrdersByUser(Long userId) {
		return orderRepository.findByUserId(userId);
	}
	
	public List<MyOrder> getAllMyOrders() {
        return orderRepository.findAll();
    }

    public MyOrder updateOrderStatus(Long orderId, String status) {
        MyOrder myorder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        myorder.setStatus(status);
        return orderRepository.save(myorder);
    }
    
    public List<MyOrder> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
}

//package com.itv.sport.service;
//
//
//
//import org.springframework.stereotype.Service;
//
//import com.itv.sport.model.MyOrder;
//import com.itv.sport.model.OrderItem;
//import com.itv.sport.repository.MyOrderRepository;
//import com.itv.sport.repository.OrderItemRepository;
//
//@Service
//public class MyOrderService {
//    private final MyOrderRepository myOrderRepository;
//    private final OrderItemRepository orderItemRepository;
//
//    public MyOrderService(MyOrderRepository myOrderRepository, OrderItemRepository orderItemRepository) {
//        this.myOrderRepository = myOrderRepository;
//        this.orderItemRepository = orderItemRepository;
//    }
//
//    public MyOrder placeOrder(MyOrder myOrder) {
//        MyOrder savedOrder = myOrderRepository.save(myOrder);
//
//        for (OrderItem item : myOrder.getOrderItems()) {
//            item.setMyOrder(savedOrder);
//            orderItemRepository.save(item);
//        }
//
//        return savedOrder;
//    }
//}
//	