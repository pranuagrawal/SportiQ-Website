import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/MyOrders.css"; 
import Navbar from "../components/Navbar";
import StatusTracker from "../components/StatusTracker";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
            fetchOrders(storedUser.id);
        } else {
            setError("User ID not found. Please log in.");
        }

        // Listen for order updates from the Admin panel
        const handleOrderUpdate = () => fetchOrders(storedUser?.id);
        window.addEventListener("orderUpdated", handleOrderUpdate);

        return () => {
            window.removeEventListener("orderUpdated", handleOrderUpdate);
        };
    }, []);

    const fetchOrders = async (userId) => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:8024/api/order`, {
                params: { userId },
                headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
            });
            setOrders(response.data);
        } catch (error) {
            setError("Error fetching orders. Please try again.");
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <><Navbar/>
        <div className="order-history-container">
            <h1>My Orders</h1>

            {loading && <p>Loading orders...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

            {!loading && !error && orders.length > 0 && orders.map((order) => (
                <div key={order.id} className="order-card">
                    <h3>Order ID: {order.id}</h3>
                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Address:</strong> {order.address? order.address:"N/A"}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod ? order.paymentMethod: "N/A"}</p>
                    <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
                    <StatusTracker currentStatus={order.status} />

                    <h4>Items:</h4>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.product.id}>
                                {item.product.name} - ₹{item.product.price} x {item.quantity}
                            </li>
                        ))}
                    </ul>

                    <h3><strong>Total Price: ₹{order.totalPrice.toFixed(2)}</strong></h3>
                </div>
            ))}
        </div>
        </>
    );
};

export default MyOrders;
