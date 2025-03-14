import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
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

  const handleLogout = () => {
    const lastPage = window.location.pathname; // ✅ Store the current page
    localStorage.setItem("lastPage", lastPage);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    toast.success("You have been logged out.", { autoClose: 2000 });
  
    setTimeout(() => {
      navigate(lastPage); // ✅ Redirect to last visited page
      window.location.reload();
    }, 2000);
  };
  
  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={favicon} alt="FeastFinder Logo" width="40" height="40" className="me-2" />
            <span className="fw-bold fs-3 nav-head">FeastFinder</span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link custom-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link custom-link" to="/about">About Us</Link></li>
              <li className="nav-item"><Link className="nav-link custom-link" to="/eventslist">Event List</Link></li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                  <span className="me-1"><i className="fa-solid fa-user"></i></span> Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {!isLoggedIn ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/signup" onClick={() => localStorage.setItem("lastPage", window.location.pathname)}>Signup</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/login" onClick={() => localStorage.setItem("lastPage", window.location.pathname)}>Login</Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
}

export default Navbar;
