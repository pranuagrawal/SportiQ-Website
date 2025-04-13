import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Login.css";
import loginImage from "../assets/myimages/handshake.png";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER"); // Added role selection
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8024/api/users/login", { username, password });
            const userData = response.data;

            // Check if selected role matches user's actual role
            if (userData.role !== role) {
                alert(`Login failed! You are registered as a ${userData.role}, but you tried to log in as a ${role}. Please select the correct role.`);
                setLoading(false);
                return;
            }
            
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userId", userData.id);
            localStorage.setItem("token", userData.token);
            setUser(userData);

            // Fetch cart items for the logged-in user if cartId matches
            if (userData.cartId) {
                const cartResponse = await axios.get(`http://localhost:8024/api/cart?userId=${userData.id}`);
                localStorage.setItem("cart", JSON.stringify(cartResponse.data));
            }

            if (userData.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else {
                navigate("/user-dashboard");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-form">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="USER">Login as User</option>
                                <option value="ADMIN">Login as Admin</option>
                            </select>
                            <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                            <a href="/register" className="auth-link">Don't have an account? Sign up</a>
                        </form>
                    </div>
                    <div className="auth-image">
                        <img src={loginImage} alt="Login" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
