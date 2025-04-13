import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../css/ProductAdmin.css";
import EditIcon from "../assets/myimages/edit.png"; 
import DeleteIcon from "../assets/myimages/remove-cart.png";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8024/api/products/all");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8024/api/products/delete/${productId}`);
      alert("✅ Product deleted successfully!");
      fetchProducts(); // Refresh product list after deletion
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    console.log("Navigating to edit with product:", product);
    navigate(`/admin/edit-product/${product.id}`, { state: { product } });
  };

  return (
    <>
      <Navbar />
      <div className="admin-product-container">
        <h2>Manage Products</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    className="product-image"
                    src={
                      product.image.startsWith("http")
                        ? product.image
                        : `http://localhost:8024/${product.image}`
                    }
                    alt={product.name}
                  />
                </td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                <button className="edit-btn" onClick={() => handleEdit(product)}><img src={EditIcon} alt="Edit" className="edit-icon" /> Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}><img src={DeleteIcon} alt="Delete" className="delete-icon" /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductAdmin;
