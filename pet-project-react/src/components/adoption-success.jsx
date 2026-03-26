import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaPaw, FaEnvelope, FaCheckCircle, FaHeart } from "react-icons/fa";
import "../assets/adoption-success.css";

function AdoptionSuccess() {
  const navigate = useNavigate();

  // Get the completed adoption details from localStorage
  const adoptionData = JSON.parse(localStorage.getItem("adoptionComplete") || "{}");

  const handleGoHome = () => {
    // Clear the adoption data
    localStorage.removeItem("adoptionRequest");
    localStorage.removeItem("adoptionComplete");
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-wrapper">
        <div className="success-card">
          {/* Animated Celebration */}
          <div className="celebration">
            <div className="confetti confetti-1"></div>
            <div className="confetti confetti-2"></div>
            <div className="confetti confetti-3"></div>
            <div className="confetti confetti-4"></div>
            <div className="confetti confetti-5"></div>
          </div>

          {/* Main Icon */}
          <div className="success-main-icon">
            <FaCheckCircle />
          </div>

          {/* Header */}
          <div className="success-header">
            <h1>🎉 Adoption Complete!</h1>
            <p className="congrats-text">Congratulations on your new furry family member!</p>
          </div>

          {/* Pet Info */}
          {adoptionData.petName && (
            <div className="adopted-pet-info">
              <div className="pet-avatar">
                <FaPaw />
              </div>
              <div className="pet-details">
                <h2>{adoptionData.petName}</h2>
                <p>Has found their forever home!</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          <div className="success-message">
            <div className="message-box">
              <FaHeart className="heart-icon" />
              <p>
                Thank you for adopting! You've made a wonderful decision that will 
                bring joy and companionship to your life. Get ready for countless 
                happy moments with your new best friend!
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul className="steps-list">
              <li>
                <span className="step-number">1</span>
                <span>Check your email for adoption confirmation and paperwork details</span>
              </li>
              <li>
                <span className="step-number">2</span>
                <span>Visit our shelter during pickup hours to meet your new pet</span>
              </li>
              <li>
                <span className="step-number">3</span>
                <span>Bring valid ID and adoption fee receipt</span>
              </li>
              <li>
                <span className="step-number">4</span>
                <span>Enjoy your new companionship!</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <FaEnvelope />
            <p>Questions? Contact us at <strong>info@petadopt.com</strong> or call <strong>+254 757445696</strong></p>
          </div>

          {/* Actions */}
          <div className="success-actions">
            <button onClick={handleGoHome} className="btn-home">
              <FaHome /> Back to Home
            </button>
            <Link to="/pets" className="btn-browse">
              Browse More Pets
            </Link>
          </div>

          {/* Footer Note */}
          <div className="footer-note">
            <p>🐾 Thank you for choosing to adopt! You gave a pet a second chance at happiness. 🐾</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionSuccess;
