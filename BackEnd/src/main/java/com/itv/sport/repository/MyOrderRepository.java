//package com.itv.sport.repository;
//
//import java.util.List;

//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import com.itv.sport.model.MyOrder;
//
//public interface OrderRepository extends JpaRepository<MyOrder, Long> {
//
//    List<MyOrder> findByUserId(Long userId); // Find orders by userId
//    List<MyOrder> findAll(); // Find all orders for admin panel
//
//    // Corrected query to use the correct entity class name 'MyOrder'
//    @Query("SELECT COUNT(o) FROM MyOrder o WHERE o.status = 'PENDING'")
//    int countPendingOrders();
//
//    // Corrected query to use the correct entity class name 'MyOrder'
//    @Query("SELECT COUNT(o) FROM MyOrder o WHERE o.status = 'Delivered'")
//    int countCompletedOrders();
//
//    long countByStatus(String status);
//
//    // Find orders by status
//    List<MyOrder> findByStatus(String status);
//
//    @Query("SELECT COUNT(o) FROM MyOrder o")
//    int countTotalOrders();

//    List<MyOrder> findByUserIdAndStatus(Long userId, String status);
//}

package com.itv.sport.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itv.sport.model.MyOrder;

@Repository
public interface MyOrderRepository extends JpaRepository<com.itv.sport.model.MyOrder, Long> {

	List<MyOrder> findByUserId(Long userId);

	List<MyOrder> findByStatus(String status);

	List<MyOrder> findByUserIdAndStatus(Long userId, String status);

	long countByStatus(String string);
}

