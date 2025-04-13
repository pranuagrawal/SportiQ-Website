import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Welcome.css";
import videoSrc from "../assets/myimages/Welcome-page.mp4"; // Import video correctly

const Welcome = () => {
  return (
    <div>
      <Navbar />
      <div className="welcome-hero-container">
        {/* Background Video */}
        <video className="welcome-hero-video" autoPlay loop muted playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="welcome-hero-overlay"></div>

        {/* Hero Content */}
        <div className="welcome-hero-content">
          <motion.h1
            className="welcome-hero-title"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
             Welcome to<span className="brand-name"> SportiQ</span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
