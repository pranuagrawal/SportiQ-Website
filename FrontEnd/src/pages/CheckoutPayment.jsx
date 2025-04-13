import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/CheckoutPayment.css";
import Navbar from "../components/Navbar";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems = [],
    promoCode = "",
    discount = 0,
    subtotal = cartItems.length > 0
      ? cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      : 0,
  } = location.state || {};

  const GST = subtotal * 0.18;
  const totalAmount = subtotal + GST - discount;

  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
      setAddress(storedUser.address || "");
    } else {
      console.log("User ID not found in localStorage");
      alert("User ID not found. Please log in again.");
    }
  }, []);

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter a valid shipping address.");
      return;
    }

    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      const { cardNumber, expiryDate, cvv } = cardDetails;

      if (cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
        alert("Card number must be 16 digits.");
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        alert("Expiry date must be in MM/YY format and a valid month.");
        return;
      }

      const [expMonth, expYear] = expiryDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        alert("Card has expired. Please use a valid card.");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits.");
        return;
      }
    }

    const orderData = {
      user: { id: userId },
      address: address,
      items: cartItems.map((item) => ({
        product: { id: item.product.id },
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: totalAmount,
      paymentMethod,
      promoCode,
      status: "Processing",
      orderDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:8024/api/order/createorder", orderData);
      if (response.status === 201) {
        await axios.delete(`http://localhost:8024/api/cart/clear?userId=${userId}`);
        alert("Order has been Successfully Placed.");
        navigate("/order-confirmation", { state: { orderId: response.data.id } });
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const formatMethod = (method) => {
    if (method === "cod") return "Cash on Delivery";
    return method.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <Navbar />
      <div className="checkout-payment-container">
        <h1>Checkout & Payment</h1>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product.id} className="checkout-product">
              <p>{item.product.name} - ₹{item.product.price} x {item.quantity}</p>
              <p><strong>Total: ₹{(item.product.price * item.quantity).toFixed(2)}</strong></p>
            </div>
          ))}
          <div className="checkout-total">
            <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
            <p>GST (18%): ₹{GST.toFixed(2)}</p>
            <p>Promo Code: {promoCode || "No promo code applied"}</p>
            <p>Discount: ₹{discount.toFixed(2)}</p>
            <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
          </div>
        </div>

        <div className="checkout-details">
          <h2>Shipping Address</h2>
          <textarea
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your shipping address"
            rows="4"
            required
          />
        </div>

        <div className="payment-method">
          <h2>Payment Method</h2>
          <div className="payment-method-options">
            {["cod", "credit-card", "debit-card"].map((method) => (
              <div key={method}>
                <input
                  type="radio"
                  id={method}
                  name="payment-method"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={handlePaymentMethodChange}
                />
                <label htmlFor={method}>{formatMethod(method)}</label>
              </div>
            ))}
          </div>

          {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
            <div className="card-details">
              <h3>Enter Your Card Details</h3>

              <div className="card-details-row">
                <label htmlFor="card-number">Card Number:</label>
                <input
                  type="text"
                  id="card-number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    handleCardDetailChange({
                      target: { name: "cardNumber", value: onlyNums },
                    });
                  }}
                  placeholder="1234 5678 1234 5678"
                  required
                  maxLength="16"
                  title="Card number must be 16 digits"
                />
              </div>

              <div className="card-details-row">
                <label htmlFor="expiry-date">Expiry Date:</label>
                <input
                  type="text"
                  id="expiry-date"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => {
                    let input = e.target.value.replace(/[^\d]/g, "");
                    if (input.length > 2) {
                      input = input.slice(0, 2) + "/" + input.slice(2, 4);
                    }
                    handleCardDetailChange({
                      target: { name: "expiryDate", value: input },
                    });
                  }}
                  placeholder="MM/YY"
                  required
                  maxLength="5"
                  title="Expiry date must be in MM/YY format"
                />
              </div>

              <div className="card-details-row">
                <label htmlFor="cvv">CVV:</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    handleCardDetailChange({
                      target: { name: "cvv", value: onlyNums },
                    });
                  }}
                  placeholder="123"
                  required
                  maxLength="3"
                  title="CVV must be 3 digits"
                />
              </div>
            </div>
          )}
        </div>

        <div className="checkout-button">
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPayment;

