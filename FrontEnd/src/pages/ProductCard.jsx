import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/ProductCard.css";
import StarFilled from "../assets/myimages/star.png";
import WishList_Empty from "../assets/myimages/heart-empty.png";
import WishList_Filled from "../assets/myimages/heart-filled.png";
import cartCheckImg from "../assets/myimages/checked.png";
import Cross from "../assets/myimages/cross.png";

const ProductCard = ({ product }) => {
  const [wishlist, setWishlist] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

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

  return (
    <>
      <div className="productcard-container" key={product.id}>
        <div className="productcard">
          <Link to={`/product/${product.id}`} className="productcard-link">
            <div className="productcard-img-box">
              <img src={product.image} className="productcard-img" alt={product.name} />
            </div>
          </Link>
          <div className="productcard-body">
            <h5 className="productcard-title">{product.name}</h5>
            <p className="productcard-description">{product.description}</p>
            <div className="productcard-info">
              <p className="productcard-category">Category: {product.category}</p>
              <p className="productcard-price">Price: ₹{product.price}</p>
              <p className="productcard-rating">
                {[...Array(5)].map((_, index) => (
                  <img key={index} src={StarFilled} alt="star" className="productcard-star-icon" />
                ))}
                <span> (100 reviews)</span>
                <span onClick={() => toggleWishlist(product.id)} className="productcard-wishlist-icon">
                  <img src={wishlist.includes(product.id) ? WishList_Filled : WishList_Empty} alt="Wishlist" />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="productcard-popup">
          <img src={popupMessage.includes("Added") ? cartCheckImg : Cross} alt="wishlist-icon" className="productcard-popup-icon" />
          {popupMessage}
        </div>
      )}
    </>
  );
};

export default ProductCard;
