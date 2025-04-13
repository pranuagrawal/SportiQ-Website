import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import star from "../assets/myimages/star.png";
import star_dull from "../assets/myimages/star_dull.png";
import cartCheckImg from "../assets/myimages/checked.png";
import WishList_Empty from "../assets/myimages/heart-empty.png";
import WishList_Filled from "../assets/myimages/heart-filled.png";
import Cross from "../assets/myimages/cross.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/ProductDetails.css"; 
import { CartItems } from "./CartItems";

const ProductDetails = ({ userId }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false); // State for cart popup

  useEffect(() => {
    fetchProduct();
    fetchWishlist();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8024/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  };

  const toggleWishlist = (id) => {
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(id)) {
      updatedWishlist = updatedWishlist.filter((item) => item !== id);
      setPopupMessage("Removed from Wishlist");
    } else {
      updatedWishlist.push(id);
      setPopupMessage("Added to Wishlist");
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleAddToCart = async () => {
        try {
          await axios.post(`http://localhost:8024/api/cart/add/${productId}?quantity=1&userId=${userId}`,CartItems);
          setPopupMessage("Added to Cart");
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 2000);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      };

  if (!product) return <p className="loading-message">Loading product details...</p>;

  return (
    <>
      <Navbar />
      <div className="productdisplay-container">
        {/* Left Side - Image */}
        <div className="productdisplay-left">
          <div className="productdisplay-img-box">
            <img src={product.image} alt={product.name} className="productdisplay-main-img" />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="productdisplay-right">
          <h1 className="productdisplay-title">{product.name}</h1>
          <div className="productdisplay-rating">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={star} alt="star" className="productdisplay-star" />
            ))}
            <img src={star_dull} alt="star dull" className="productdisplay-star" />
            <p className="productdisplay-review-count">(3121 reviews)</p>
          </div>
          <div className="productdisplay-prices">
            <div className="productdisplay-price-old">₹{product.price}</div>
            <div className="productdisplay-price-new">₹{product.price}</div>
          </div>
          <div className="productdisplay-description">{product.description}</div>

          {/* Buttons */}
          <div className="productdisplay-buttons">
            <button className="productdisplay-cart-btn" onClick={() => handleAddToCart(product)}>
              ADD TO CART
            </button>
            <button 
              className="productdisplay-buy-btn" 
              onClick={() => navigate("/checkoutpayment", { state: { cartItems: [{ product, quantity: 1 }], subtotal: product.price } })}
            >
              BUY NOW
            </button>
            <span onClick={() => toggleWishlist(product.id)} className="productdisplay-wishlist-icon">
              <img
                src={wishlist.includes(product.id) ? WishList_Filled : WishList_Empty}
                alt="Wishlist"
                className="productdisplay-wishlist-img"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Wishlist Popup */}
      {showPopup && (
        <div className="productdisplay-popup">
          <img src={popupMessage.includes("Added") ? cartCheckImg : Cross} alt="popup-icon" className="productdisplay-popup-icon" />
          {popupMessage}
        </div>
      )}

      {/* Cart Popup */}
      {showCartPopup && (
        <div className="productdisplay-popup">
          <img src={cartCheckImg} alt="cart-icon" className="productdisplay-popup-icon" />
          Added to Cart
        </div>
      )}
      <Footer/>
    </>
  );
};

export default ProductDetails;
