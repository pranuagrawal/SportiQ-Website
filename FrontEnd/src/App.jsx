import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddProducts from "./pages/AddProducts";
import ProductAdmin from "./pages/ProductAdmin";
import UpdateProductForm from "./pages/UpdateProductForm";
import Welcome from "./components/Welcome";
import UserAllProducts from "./pages/UserAllProducts";
import ProductDetails from "./pages/ProductDetails";
import { CartItems } from "./pages/CartItems";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import CheckoutPayment from "./pages/CheckoutPayment";
import AdminOrders from "./pages/Adminorders";
import AdminUsers from "./pages/AdminUsers";
import Wishlist from "./pages/Wishlist";

function App() {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  return (
    <Router>
      <MainApp user={user} setUser={setUser} />
    </Router>
  );
}

function MainApp({ user, setUser }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      // Clear localStorage when navigating to home page
      localStorage.removeItem("user");
      setUser(null); // Update user state accordingly
    }
  }, [location.pathname, setUser]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/add-product" element={<AddProducts />} />
      <Route path="/admin/products" element={<ProductAdmin />} />
      <Route path="/admin/edit-product/:productId" element={<UpdateProductForm />} />
      <Route path="/all-product-list" element={<UserAllProducts />} />
      <Route path="/product/:productId" element={<ProductDetails userId={user?.id} />} />
      <Route path="/cart" element={<CartItems userId={user?.id} />} />
      <Route path="/checkoutpayment" element={<CheckoutPayment />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path= "/orders" element={<AdminOrders/>}/>
      <Route path = "/admin/users" element={<AdminUsers/>}/>
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;
