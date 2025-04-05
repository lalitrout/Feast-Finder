import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Collapse } from "bootstrap";
import "./Navbar.css";
import { toast } from "react-toastify";
import favicon from "./assets/favicon-32x32.png";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const closeNavbar = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar.classList.contains("show")) {
      const bsCollapse = new Collapse(navbar, { toggle: false });
      bsCollapse.hide();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");

      if (navbar.classList.contains("show") && !navbar.contains(event.target) && !toggler.contains(event.target)) {
        closeNavbar();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const lastPage = window.location.pathname;
    localStorage.setItem("lastPage", lastPage);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    toast.success("You have been logged out.", { autoClose: 2000 });

    setTimeout(() => {
      navigate(lastPage);
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeNavbar}>
            <img src={favicon} alt="FeastFinder Logo" width="40" height="40" className="me-2" />
            <span className="fw-bold fs-3 nav-head">FeastFinder</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/" onClick={closeNavbar}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/about" onClick={closeNavbar}>
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/eventslist" onClick={closeNavbar}>
                  Event List
                </Link>
              </li>

              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link custom-link" to="/signup" onClick={closeNavbar}>
                      Signup
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link custom-link" to="/login" onClick={closeNavbar}>
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button className="nav-link custom-link btn btn-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
}

export default Navbar;
