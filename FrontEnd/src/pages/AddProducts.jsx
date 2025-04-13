import React, { useState } from "react";
import axios from "axios";
import "../css/AddProducts.css";
import Navbar from "../components/Navbar";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload (store file)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.stock || !image) {
      setError("All fields are required");
      setMessage("");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("stock", formData.stock);
    form.append("image", image);

    try {
      await axios.post("http://localhost:8024/api/products/add", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product added successfully!");
      setMessage("✅ Product added successfully!");
      setError("");
      handleCancel(); // Clear form after successful submission
    } catch (err) {
      setError("❌ Error adding product. Please try again.");
      setMessage("");
    }
  };

  // Handle cancel button click (Clears form)
  const handleCancel = () => {
    setFormData({ name: "", price: "", category: "", description: "", stock: "" });
    setImage(null);
    setError("");
    setMessage("");
  };

  return (
    <div>
      <Navbar />
      <div className="add-product-main-container">
        <div className="add-product-wrapper">
          {/* Left Side - Form Section */}
          <div className="add-product-form-section">
            <h2>Add New Product</h2>

            {message && <p className="add-product-success">{message}</p>}
            {error && <p className="add-product-error">{error}</p>}

            <form onSubmit={handleSubmit} className="add-product-form">
              <label className="add-product-label">Product Name</label>
              <input type="text" name="name" className="add-product-input" value={formData.name} onChange={handleChange} required />

              <label className="add-product-label">Price</label>
              <input type="number" name="price" className="add-product-input" value={formData.price} onChange={handleChange} required/>

              <label className="add-product-label">Category</label>
              <select name="category" className="add-product-input" value={formData.category} onChange={handleChange} required>
                <option value="Fitness Accessories">Fitness Accessories</option>
                <option value="Sports">Sports</option>
                <option value="Sports Glasses">Sports Glasses</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Football">Football</option>
              </select>
              
              <label className="add-product-label">Description</label>
              <textarea name="description" className="add-product-input" value={formData.description} onChange={handleChange} required/>

              <label className="add-product-label">Stock</label>
              <input type="number" name="stock" className="add-product-input" value={formData.stock} onChange={handleChange} required/>

              <label className="add-product-label">Product Image</label>
              <input type="file" className="add-product-input" onChange={handleImageChange} required/>

              <div className="add-product-btn-group">
                <button type="submit" className="add-product-btn add-product-btn-success">Add Product</button>
                <button type="button" className="add-product-btn add-product-btn-danger" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
