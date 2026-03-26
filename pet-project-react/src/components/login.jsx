import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../assets/login.css";
import apiService from "../services/api";

export default function Login() {
  // Unified form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "adopter"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending to API:", formData);

      const response = await apiService.login(formData);

      console.log("Login response:", response);

      if (response.success) {
        // Save user in context
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          token: response.token
        };

        login(userData);

        // Redirect based on role
        navigate(userData.role === "admin" ? "/admin" : "/pets");
      } else {
        setError(response.message || "Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login">
      <div className="header">
        <h2>🐾 Login to PetAdopt</h2>
      </div>

      <div className="container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {/* Role Selection */}
          <div className="role-selection">
            <label>Login as:</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${formData.role === "adopter" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, role: "adopter" })}
              >
                Adopter 
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === "admin" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, role: "admin" })}
              >
                Admin 
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Links */}
          <div className="links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <p>
              New user? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}