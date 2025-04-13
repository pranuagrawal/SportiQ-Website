import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/UpdateProductForm.css";

const UpdateProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "",
    description: product?.description || "",
    stock: product?.stock || "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/admin/products"); // Redirect if no product data is available
    }
  }, [product, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.stock) {
      setError("All fields are required.");
      setMessage("");
      return;
    }

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("price", formData.price);
    updateData.append("category", formData.category);
    updateData.append("description", formData.description);
    updateData.append("stock", formData.stock);
    
    if (image) {
      updateData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:8024/api/products/update/${product.id}`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      setMessage("Product updated successfully!");
      setError("");
      navigate("/admin/products"); // Redirect back to admin product list
    } catch (error) {
      console.error("❌ Error updating product:", error);
      setError("Failed to update product.");
      setMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="update-product-main-container">
      <div className="update-product-wrapper">
        {/* Left Side - Form Section */}
        <div className="update-product-form-section">
          <h2>Update Product</h2>

          {message && <p className="update-product-success">{message}</p>}
          {error && <p className="update-product-error">{error}</p>}

          <form onSubmit={handleSubmit} className="update-product-form">
            <label className="update-product-label">Product Name</label>
            <input type="text" name="name" className="update-product-input" value={formData.name} onChange={handleChange} required />

            <label className="update-product-label">Price</label>
            <input type="number" name="price" className="update-product-input" value={formData.price} onChange={handleChange} required />

            <label className="update-product-label">Category</label>
            <select name="category" className="update-product-input update-product-custom-select" value={formData.category} onChange={handleChange} required>
              <option value="Fitness Accessories">Fitness Accessories</option>
              <option value="Sports">Sports</option>
              <option value="Sports Glasses">Sports Glasses</option>
              <option value="Badminton">Badminton</option>
              <option value="Tennis">Tennis</option>
              <option value="Football">Football</option>
            </select>

            <label className="update-product-label">Description</label>
            <textarea name="description" className="update-product-input" value={formData.description} onChange={handleChange} required />

            <label className="update-product-label">Stock</label>
            <input type="number" name="stock" className="update-product-input" value={formData.stock} onChange={handleChange} required />

            <label className="update-product-label">Product Image</label>
            <input type="file" className="update-product-input" onChange={handleFileChange} accept="image/*" required />

            <div className="update-product-btn-group">
              <button type="submit" className="update-product-btn update-product-btn-success">Update Product</button>
              <button type="button" className="update-product-btn update-product-btn-danger" onClick={() => navigate("/admin/products")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UpdateProductForm;
