import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/OrderConfirmation.css";
import OrderConfirmed from "../assets/myimages/order-confirmed.png";

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [showTick, setShowTick] = useState(false);

    useEffect(() => {
        // Show green tick after a delay
        setTimeout(() => {
            setShowTick(true);
        }, 500);

        // Redirect to home/shop after 4 seconds
        setTimeout(() => {
            navigate("/all-product-list");
        }, 4000);
    }, [navigate]);

    return (
        <div className="order-confirmation-container">
            {showTick && <img src={OrderConfirmed} alt="Success" className="order-confirmed" />}
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with us. Redirecting to the shop...</p>
        </div>
    );
};

export default OrderConfirmation;
