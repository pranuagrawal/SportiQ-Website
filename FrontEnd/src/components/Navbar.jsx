import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Navbar.css";
import logo from "../assets/myimages/sportiQ.png"; 
import profileImage from "../assets/myimages/user.png";
import cartImage from "../assets/myimages/cart.png";
import wishlistImage from "../assets/myimages/wishlist.png";

const Navbar = ({ scrollToCategory, setProducts, cartCount, isWelcome }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "GUEST";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const profileRef = useRef(null); 

  const categories = ["Sports Glasses", "Sports", "Badminton", "Tenis"];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const response = await axios.get("http://localhost:8024/api/products/search", {
        params: { name: searchTerm, title: searchTerm },
      });

      const products = response.data;

      if (products.length === 1) {
        navigate(`/product/${products[0].id}`);
      } else if (products.length > 1) {
        if (typeof setProducts === "function") {
          setProducts(products);
        }
        navigate("/user-dashboard");
      } else {
        alert("No products found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) { // Close profile dropdown on outside click
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
<div>
  <Link to="/" className="logo">
    <img src={logo} alt="SportiQ Logo" className="logo-img" />
  </Link>
</div>

      <ul className="nav-links">
        {isWelcome ? (
          <>
            <li><Link to="/aboutus" className="about-link">About Us</Link></li>
            <li><Link to="/login" className="login-link">Log In</Link></li>
            <li><Link to="/register" className="create-account-link">Register</Link></li>
          </>
        ) : role === "ADMIN" ? (
          <>
            <li><Link to="/admin-dashboard">Home</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/add-product">Add Product</Link></li>
            {/* Profile Dropdown */}
            <li className="profile-container" ref={profileRef}>
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <img src={profileImage} alt="Profile" className="profile-img" /> {user?.name} ▼
              </button>
              {profileOpen && (
                <ul className="profile-dropdown">
                  <li><Link to="/orders">Orders</Link></li>
                  <li><Link to="/admin/users">Registered Users</Link></li>
                  <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </li>
          </>
        ) : role === "USER" ? (
          <>
            <li><Link to="/user-dashboard">Home</Link></li>
            <li><Link to="/all-product-list">Products</Link></li>
            <li><Link to="/cart"><img src={cartImage} alt="Cart" className="cart-img" /> Cart</Link></li>
            <li><Link to="/wishlist"><img src={wishlistImage} alt="Wishlist" className="wishlist-img" /> Wishlist</Link></li>

            {/* Profile Dropdown */}
            <li className="profile-container" ref={profileRef}>
              <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              <img src={profileImage} alt="Profile" className="profile-img" />  {user?.name} ▼
              </button>
              {profileOpen && (
                <ul className="profile-dropdown">
                  <li><Link to="/my-orders">My Orders</Link></li>
                  <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li><Link to="/aboutus" className="about-link">About Us</Link></li>
            <li><Link to="/login" className="login-link">Log In</Link></li>
            <li><Link to="/register" className="create-account-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
