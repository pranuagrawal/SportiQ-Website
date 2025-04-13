import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Wishlist.css"; 
import WishList_Filled from "../assets/myimages/heart-filled.png";
import WishList_Empty from "../assets/myimages/heart-empty.png";
import cartCheckImg from "../assets/myimages/checked.png";
import Navbar from "../components/Navbar";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
    fetchWishlistProducts(savedWishlist);
  }, []);

  const fetchWishlistProducts = async (wishlistIds) => {
    try {
      const response = await Promise.all(
        wishlistIds.map((id) => fetch(`http://localhost:8024/api/products/${id}`).then((res) => res.json()))
      );
      setProducts(response);
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <h2>My Wishlist</h2>

        {products.length === 0 ? (
          <p className="empty-message">Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-grid">
            {products.map((product) => (
              <div key={product.id} className="wishlist-item">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="wishlist-image" />
                </Link>
                <div className="wishlist-details">
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <button className="remove-btn" onClick={() => removeFromWishlist(product.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
