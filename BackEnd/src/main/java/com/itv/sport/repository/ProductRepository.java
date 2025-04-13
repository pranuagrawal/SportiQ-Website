package com.itv.sport.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itv.sport.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

	List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category);

	List<Product> findByCategoryContainingIgnoreCase(String category);
	
	@Query("SELECT DISTINCT p.category FROM Product p")
	List<String> findDistinctCategories();
	
	 @Query("SELECT p FROM Product p ORDER BY " +
	           "CASE WHEN :sortOrder = 'asc' THEN p.price END ASC, " +
	           "CASE WHEN :sortOrder = 'desc' THEN p.price END DESC")
	    List<Product> findAllSortedByPrice(@Param("sortOrder") String sortOrder);
}
