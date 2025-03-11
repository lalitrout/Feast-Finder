import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          {/* Title */}
          <h1 className="fw-bold custom-color mb-4">About Us</h1>

          {/* Mission */}
          <p className="fs-5 text-muted">
            At <span className="fw-semibold custom-color">FeastFinder</span>, we believe that 
            <strong> no good food should go to waste</strong> and 
            <strong> no hungry stomach should stay empty</strong>—especially when grand buffets are waiting to be enjoyed!
          </p>

          {/* How It Works */}
          <h2 className="fw-semibold custom-color mt-4">How It Works</h2>
          <p className="fs-5 text-muted">
            Our goal is to connect food lovers with  
            <span className="fw-semibold custom-color"> weddings, receptions, and charity events</span>,  
            helping people find a meal while reducing food waste. Whether you're a broke student,  
            a hungry bachelor, or just someone who loves a good feast,  
            <span className="fw-semibold custom-color"> FeastFinder ensures you never miss out!</span>
          </p>

          {/* Who We Are */}
          <h2 className="fw-semibold custom-color mt-4">Who We Are</h2>
          <p className="fs-5 text-muted">
            FeastFinder was created by <span className="fw-semibold">Lalit Rout & Sagar Gouda</span> with a simple idea:  
            <i> "Why should delicious food go uneaten when there are people who’d love to enjoy it?"</i>  
            What started as a fun thought turned into a platform where users help each other  
            discover feasts, share locations, and enjoy food without the awkward  
            <i> "Who invited you?"</i> question.
          </p>

          {/* Disclaimer */}
          <h2 className="fw-semibold custom-color mt-4">Not Here to Cause Chaos! 🚨</h2>
          <p className="fs-5 text-muted">
            We know that <strong>crashing events</strong> might raise a few eyebrows.  
            <span className="fw-semibold custom-color"> FeastFinder <strong>does not</strong> promote unethical behavior</span>.  
            Think of this as <strong>friends helping friends</strong>—whether it’s students struggling to make ends meet  
            or someone truly in need of a meal. At the end of the day, it’s all about  
            <span className="fw-semibold custom-color"> reducing food waste and spreading kindness! </span> ❤️🍽️  
          </p>

          {/* Call to Action */}
          <h2 className="fw-semibold custom-color mt-4">Join Us!</h2>
          <p className="fs-5 text-muted">
            Become part of the <span className="fw-semibold custom-color">FeastFinder</span> movement.  
            Whether you’re spotting a feast or crashing one, let’s make sure every plate is full! 🎉🍽️
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
