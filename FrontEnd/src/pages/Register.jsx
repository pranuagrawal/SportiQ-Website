import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/Login.css";
import loginImage from "../assets/myimages/handshake.png";

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mobileno, setMobileno] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8024/api/users/register", {
                name,
                username,
                email,
                mobileno,
                password,
                role: "USER", // Default role set to USER
            });

            if (response.status === 201) {
                alert("Registration successful! Please login.");
                navigate("/login");
            }
        } catch (error) {
            alert("Registration failed: " + (error.response?.data || "Unknown error"));
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-form">
                        <h2>Register</h2>
                        <form onSubmit={handleRegister}>
                            <input type="text" placeholder="Enter your Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="text" placeholder="Enter your Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input type="text" placeholder="Enter your Mobile Number" value={mobileno} pattern="[0-9]{10}" onChange={(e) => setMobileno(e.target.value)} required />
                            <input type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit">Register</button>
                            <a href="/login" className="auth-link">Already have an account? Login</a>
                        </form>
                    </div>
                    <div className="auth-image-register">
                        <img src={loginImage} alt="Register" />
                      </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
