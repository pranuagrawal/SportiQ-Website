import React from "react";
import "../css/AboutUs.css";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <section className="about-us">
        <div className="aboutus-text-container">
          <h1 className="aboutus-title">About SportiQ</h1>
          <p className="aboutus-text">
            SportiQ is your go-to destination for premium sports gear and apparel. 
            We bring you top-quality products from leading brands to fuel your passion for sports.
          </p>
          <p className="aboutus-text">
            Our mission is to provide athletes, fitness enthusiasts, and sports lovers with 
            the best equipment to help them achieve their goals.
          </p>
          <p className="aboutus-text">
            Join us on this journey and elevate your game with SportiQ!
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
