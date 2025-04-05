import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css"; // includes the orange styling

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://feast-finder.onrender.com/api/login", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        toast.success("Login successful! Redirecting...", { autoClose: 2000 });

        setTimeout(() => {
          const lastPage = localStorage.getItem("lastPage") || "/";
          localStorage.removeItem("lastPage");
          navigate(lastPage);
        }, 2000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card login-card shadow-lg p-4">
        <h3 className="text-center text-orange mb-4">FeastFinder Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-orange">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-orange">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-orange w-100" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange text-decoration-none fw-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
