import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center py-4 mt-auto"
      style={{
        backgroundColor: "#FFF5E1", // Creamy background
        color: "#333", // Dark text
        width: "100%",
      }}
    >
      <div className="container">
        <h5>Follow Us</h5>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <a
            href="#"
            className="fs-4 text-decoration-none"
            style={{ color: "#FA5" }}
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            className="fs-4 text-decoration-none"
            style={{ color: "#FA5" }}
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="#"
            className="fs-4 text-decoration-none"
            style={{ color: "#FA5" }}
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="fs-4 text-decoration-none"
            style={{ color: "#FA5" }}
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <p className="mt-3 mb-0">
          &copy; {new Date().getFullYear()} FeastFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
