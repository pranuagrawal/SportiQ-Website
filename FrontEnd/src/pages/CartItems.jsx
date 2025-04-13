import { useEffect, useState } from "react";
import "../css/CartItems.css";
import { useNavigate } from "react-router-dom";
import remove_cart from "../assets/myimages/remove-cart.png";
import axios from "axios";
import Navbar from "../components/Navbar";

export const CartItems = ({ userId }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const GST_RATE = 0.18;
    const BASE_URL = "http://localhost:8024"; // Backend Base URL

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/cart?userId=${userId}`);
            setCartItems(response.data);
            calculateSubtotal(response.data);
            updateCartCount(response.data.length);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const updateCartCount = (count) => {
        localStorage.setItem("cartCount", count);
        window.dispatchEvent(new Event("storage")); // Trigger navbar update
    };


    const calculateSubtotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setSubtotal(total);
    };

    const increaseQuantity = async (cartItemId) => {
        try {
            await axios.put(`${BASE_URL}/api/cart/increase/${cartItemId}`);
            fetchCartItems();
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (cartItemId) => {
        try {
            await axios.put(`${BASE_URL}/api/cart/decrease/${cartItemId}`);
            fetchCartItems();
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`${BASE_URL}/api/cart/remove/${cartItemId}`);
            fetchCartItems();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handlePromoCodeSubmit = () => {
        if (promoCode === "D10") {
            const discountAmount = subtotal * 0.10;
            setDiscount(discountAmount);
            setIsPromoApplied(true);
            alert("Promo code applied! 10% discount received.");
        } else {
            alert("Invalid promo code.");
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add some items before proceeding to checkout.");
            return;
        }
    
        navigate("/checkoutpayment", {
            state: {
                cartItems,
                promoCode,
                discount,
                subtotal
            }
        });
    };
    

    const GST = subtotal * GST_RATE;
    const totalAmount = subtotal + GST - discount;

    return (
        <>
        <Navbar cartCount={cartItems.length}/>
        <div className="cart-container">
            <h1>Cart Items</h1>
            <div className="cart-content">
                <div className="cart-header">
                    <p>Products</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <hr />

                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item-row">
                        <div className="cart-item-image-container">
                            <img 
                                src={item.product.image ? `${BASE_URL}/${item.product.image}` : "/default-image.png"} 
                                alt={item.product.name} 
                                className="cart-item-img" 
                                onError={(e) => { e.target.src = "/default-image.png"; }} 
                            />
                        </div>
                        <div className="cart-item-details">
                            <p className="cart-item-name">{item.product.name}</p>
                        </div>
                        <div className="cart-item-price">₹{item.product.price}</div>
                        <div className="cart-item-quantity-controls">
                            <button className="cart-item-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                            <span className="cart-item-quantity">{item.quantity}</span>
                            <button className="cart-item-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                        </div>
                        <div className="cart-item-total">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                        <img className="cart-item-remove" src={remove_cart} alt="Remove" onClick={() => removeFromCart(item.id)} />
                    </div>
                ))}

                 <div className="cartitems-promocode">
                   <p>If you have a Promo code, Enter It here</p>
                    <div className="cartitem-promodox">
                         <input 
                             type="text" 
                             placeholder='Promo Code'
                             value={promoCode} 
                             onChange={(e) => setPromoCode(e.target.value)} 
                             />
                             <button onClick={handlePromoCodeSubmit}>APPLY PROMO CODE</button>
                    </div>
                 </div>
              <div className="cart-summary">
                  <h1>CART TOTALS</h1>
                  <div className="cart-summary-details">
                   <p>Subtotal</p>
                   <p>₹{subtotal.toFixed(2)}</p>
                 </div>
                 <hr />

                 <div className="cart-summary-details">
                   <p>Shipping Fee</p>
                   <p>Free</p>
                 </div>
                 <hr />

                 <div className="cart-summary-details">
                   <p>GST (18%)</p>
                   <p>₹{GST.toFixed(2)}</p>
                 </div>
                  <hr />

                  {isPromoApplied && (
                     <div className="cartitems-total-item">
                       <p style={{ textDecoration: 'line-through', color: 'grey', margin: 0 }}> Original Total </p>
                                <p style={{ textDecoration: 'line-through', color: 'grey', margin: 0 }}>
                                    ₹{(subtotal + GST).toFixed(2)}
                                </p>
                     </div>
                    )}
                     <hr/>

                   <div className="cart-summary-total">
                     <h3>Total</h3>
                     <h3>₹{totalAmount.toFixed(2)}</h3>
                  </div>
                  <button className="cart-checkout-btn" onClick={handleCheckout}>Proceed To Checkout</button>
             </div>
          </div>
        </div>
      </>
    );
};
