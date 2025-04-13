import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/UserDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gymImage1 from "../assets/myimages/gym1.jpg";
import gymImage2 from "../assets/myimages/gym2.jpg";
import gymImage3 from "../assets/myimages/gym3.jpeg";

const UserDashboard = () => {
  const sliderSettings = {
    dots: false, // Hide navigation dots
    infinite: true, // Loop images
    speed: 800, // Transition speed
    slidesToShow: 1, // Show one image at a time
    slidesToScroll: 1,
    autoplay: true, // Enable auto-slide
    autoplaySpeed: 2000, // Slide every 2 seconds (2000ms)
    arrows: false, // Hide navigation arrows
  };
  

  return (
    <>
      <Navbar />
      <div className="slider-container">
        <Slider {...sliderSettings}>
          <div className="slide">
            <img src={gymImage1} alt="Adidas Fitness Equipment 1" />
          </div>
          <div className="slide">
            <img src={gymImage2} alt="Adidas Fitness Equipment 2" />
          </div>
          <div className="slide">
            <img src={gymImage3} alt="Adidas Fitness Equipment 3" />
          </div>
        </Slider>
        <div className="slider-text">
          <h1>Sports day Everyday!</h1>
          <p>Athleisure Collections New Arrivals</p>
          <Link to="/all-product-list">
            <button className="shop-btn">Shop Now</button>
          </Link>
        </div>
      </div>      
      <Footer/>
    </>
  );
};

export default UserDashboard;
