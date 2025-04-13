import React, { useEffect, useState } from "react";
import "../css/AdminOrders.css";
import Navbar from "../components/Navbar";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Pending"); // Default filter to Pending

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        fetch("http://localhost:8024/api/order/all")
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
    };

    const handleStatusChange = (orderId, newStatus) => {
        fetch(`http://localhost:8024/api/order/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to update order status");
            }
            return response.json().catch(() => null);
        })
        .then(() => {
            alert(`Order ${orderId} status updated to ${newStatus}`);
            fetchOrders(); // Refresh orders
        })
        .catch((error) => alert(`Error: ${error.message}`));
    };

    const filteredOrders = orders.filter(order => {
        if (filter === "Pending") {
            return order.status === "Pending" || order.status === "Processing" || order.status === "Shipped";
        } else if (filter === "Delivered") {
            return order.status === "Delivered";
        }
        return true;
    });

    return (
        <><Navbar/>
        <div className="admin-orders-container">
            <h2 className="admin-orders-title">Admin Orders</h2>

            <div className="admin-orders-button-group">
                <button 
                    className={filter === "Pending" ? "admin-orders-btn active" : "admin-orders-btn"} 
                    onClick={() => setFilter("Pending")}
                >
                    Pending Orders
                </button>
                <button 
                    className={filter === "Delivered" ? "admin-orders-btn active" : "admin-orders-btn"} 
                    onClick={() => setFilter("Delivered")}
                >
                    Delivered Orders
                </button>
            </div>

            {loading ? (
                <p className="admin-orders-loading">Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
                <p className="admin-orders-no-orders">No orders available.</p>
            ) : (
                <div className="admin-orders-table-container">
                    <table className="admin-orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Shipping Address</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Items</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user ? order.user.id : "N/A"}</td>
                                    <td>{order.user ? order.user.username : "N/A"}</td>
                                    <td>{order.address || "N/A"}</td>
                                    <td>
                                    <select
                                           className="admin-orders-select"
                                           value={order.status}
                                           onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                     <option value="Pending" disabled={order.status !== "Pending"}>Pending</option>
                                     <option value="Processing" disabled={order.status === "Shipped" || order.status === "Delivered"}>Processing</option>
                                     <option value="Shipped" disabled={order.status === "Delivered"}>Shipped</option>
                                     <option value="Delivered" disabled={order.status !== "Shipped"}>Delivered</option>
                                    </select>

                                    </td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item) => (
                                                <div key={item.id} className="admin-orders-item">
                                                    {item.product ? item.product.name : "Unknown Product"} - {item.quantity}
                                                </div>
                                            ))
                                        ) : (
                                            <span>No items</span>
                                        )}
                                    </td>
                                    <td>
                                        {order.status !== "Delivered" && (
                                            <button className="admin-orders-deliver-btn" onClick={() => handleStatusChange(order.id, "Delivered")}>
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminOrders;
