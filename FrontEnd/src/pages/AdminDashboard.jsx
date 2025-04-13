import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";
import { FaShoppingCart, FaCheckCircle, FaClipboardList, FaBox } from "react-icons/fa";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [productCount, setProductCount] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedView, setSelectedView] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchProductCount();
        fetchOrderStats();
    }, []);

    // Fetch total number of products
    const fetchProductCount = async () => {
        try {
            const response = await axios.get("http://localhost:8024/api/products/count");
            setProductCount(response.data);
        } catch (error) {
            console.error("Error fetching product count:", error);
        }
    };

    // Fetch order statistics
    const fetchOrderStats = async () => {
        try {
            const response = await axios.get("http://localhost:8024/api/order/stats");
            const { pending, delivered, total } = response.data;
            setPendingOrders(pending);
            setCompletedOrders(delivered);
            setTotalOrders(total);
        } catch (error) {
            console.error("Error fetching order stats:", error);
        }
    };

    // Fetch orders based on status
    const fetchOrdersByStatus = async (status) => {
        try {
            let url = `http://localhost:8024/api/order/status?status=${status}`;
            if (status === "All") {
                url = "http://localhost:8024/api/order/all"; // Endpoint for all orders
            }
            const response = await axios.get(url);
            setFilteredOrders(response.data);
            setSelectedView(status);
        } catch (error) {
            console.error(`Error fetching ${status} orders:`, error);
        }
    };

    const stats = [
        {
            title: "Pending Orders",
            value: pendingOrders,
            icon: <FaShoppingCart className="admin-dashboard-icon" />,
            button: "View Details",
            action: () => fetchOrdersByStatus("Pending"),
        },
        {
            title: "Completed Orders",
            value: completedOrders,
            icon: <FaCheckCircle className="admin-dashboard-icon" />,
            button: "View Details",
            action: () => fetchOrdersByStatus("Delivered"),
        },
        {
            title: "Total Orders",
            value: totalOrders,
            icon: <FaClipboardList className="admin-dashboard-icon" />,
            button: "View Details",
            action: () => fetchOrdersByStatus("All"), // Show all orders on the same page
        },
        {
            title: "Total Products Available",
            value: productCount,
            icon: <FaBox className="admin-dashboard-icon" />,
            actions: [
                { label: "See Products", path: "/admin/products" },
                { label: "Add Product", path: "/add-product" },
            ],
        },
    ];

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-container">
                {selectedView && (
                    <button className="admin-dashboard-back-btn" onClick={() => setSelectedView(null)}>
                        ⬅ Back to Dashboard
                    </button>
                )}

                {!selectedView && (
                    <div className="admin-dashboard-cards-container">
                        {stats.map((stat, index) => (
                            <div key={index} className="admin-dashboard-card">
                                {stat.icon}
                                <h3>{stat.title}</h3>
                                <p>{stat.value !== null ? stat.value : "Loading..."}</p>
                                {stat.actions ? (
                                    <div className="admin-dashboard-btn-group">
                                        {stat.actions.map((btn, i) => (
                                            <button key={i} className="admin-dashboard-card-btn" onClick={() => navigate(btn.path)}>
                                                {btn.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <button className="admin-dashboard-card-btn" onClick={stat.action}>
                                        {stat.button}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {selectedView && (
                    <div className="admin-dashboard-orders-section">
                        <h3>
                            {selectedView === "Pending"
                                ? "Pending Orders"
                                : selectedView === "Delivered"
                                ? "Completed Orders"
                                : "All Orders"}
                        </h3>
                        <table className="admin-dashboard-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User ID</th>
                                    <th>Username</th>
                                    <th>Products</th>
                                    <th>Total Price</th>
                                    <th>Shipping Address</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.user ? order.user.id : "N/A"}</td>
                                            <td>{order.user ? order.user.username : "N/A"}</td>
                                            <td>
                                                {order.items.map((item, index) => (
                                                    <div key={index}>
                                                        {item.productName} (x{item.quantity})
                                                    </div>
                                                ))}
                                            </td>
                                            <td>₹{order.totalPrice.toFixed(2)}</td>
                                            <td>{order.address || "N/A"}</td>
                                            <td>{order.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No {selectedView} orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <footer className="admin-dashboard-footer text-center text-white py-3">
                <p className="mb-0">&copy; 2025 SportiQ. All Rights Reserved.</p>
            </footer>
        </>
    );
};

export default AdminDashboard;
