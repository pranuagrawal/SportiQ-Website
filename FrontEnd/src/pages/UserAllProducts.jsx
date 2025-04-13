import React, { useEffect, useState } from "react";
import "../css/UserAllProducts.css";
import ProductCard from "./ProductCard";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(""); 

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearchAndSort();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, priceFilter, selectedCategory]); // Update when category changes

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8024/api/products/all");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  // Fetch product categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8024/api/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  // Handle search, sorting, and category filter
  const handleSearchAndSort = async () => {
    try {
      const sortOrder = priceFilter === "low-to-high" ? "asc" : priceFilter === "high-to-low" ? "desc" : "";
      const params = {};

      if (searchQuery) params.name = searchQuery;
      if (selectedCategory) params.category = selectedCategory; // Add category filter
      if (sortOrder) params.sortBy = sortOrder;

      console.log("🔎 Requesting:", params);

      const response = await axios.get("http://localhost:8024/api/products/search", { params });
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error searching/sorting products:", error);
    }
  };

  // Handle Enter key press for search
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchAndSort();
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-products-container">
        <div className="user-products-content">
          <div className="user-products-header-container">
            <h1 className="text-center mb-4">Our Products</h1>

            {/* Search, Sort & Category Filters */}
            <div className="user-products-search-container">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="user-products-search-input"
              />

              {/* Sort by Price Dropdown */}
              <select
                className="user-products-sort-dropdown"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
              </select>

              {/* Category Dropdown */}
              <select
                className="user-products-category-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display Products */}
          <div className="container my-4">
            <div className="row user-products-grid">
              {products.length > 0 ? (
                products.map((product, index) => <ProductCard key={index} product={product} />)
              ) : (
                <h3 className="text-center user-products-no-results">No products found</h3>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default UserAllProducts;
