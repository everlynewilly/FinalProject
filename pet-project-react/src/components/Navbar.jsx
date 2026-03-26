import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPaw, FaSignOutAlt, FaUser } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaPaw className="brand-icon" />
          <span>PetAdopt</span>
        </Link>
        
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          
          <li><Link to="/about">About</Link></li>
        </ul>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="user-greeting">
                <FaUser /> {user.name || user.email}
              </span>
              {user.role === "admin" && (
                <Link to="/admin" className="btn-admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
