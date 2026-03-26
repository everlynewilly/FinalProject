import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaClock, FaEnvelope, FaHome, FaCheck, FaTimes } from "react-icons/fa";
import "../assets/confirmation.css";

function Confirmation() {
  const [request, setRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the latest adoption request from localStorage
    const adoptionRequest = localStorage.getItem("adoptionRequest");
    if (adoptionRequest) {
      setRequest(JSON.parse(adoptionRequest));
    }
  }, []);

  // Poll for status changes and auto-approve after a delay for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const adoptionRequest = localStorage.getItem("adoptionRequest");
      if (adoptionRequest) {
        const parsed = JSON.parse(adoptionRequest);
        setRequest(parsed);
        
        // If approved by admin, show notification and allow navigation to payment
        if (parsed.status === "Approved") {
          alert("Congratulations! Your adoption request has been approved! You can now proceed to payment.");
        }
      }
    }, 3000);

    // Auto-approve after 5 seconds for demo/testing purposes
    const autoApproveTimer = setTimeout(() => {
      const adoptionRequest = localStorage.getItem("adoptionRequest");
      if (adoptionRequest) {
        const parsed = JSON.parse(adoptionRequest);
        if (parsed.status === "Pending") {
          parsed.status = "Approved";
          localStorage.setItem("adoptionRequest", JSON.stringify(parsed));
          setRequest(parsed);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoApproveTimer);
    };
  }, [navigate]);

  if (!request) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-wrapper">
          <div className="no-request">
            <h2>No Adoption Request Found</h2>
            <p>Please complete the screening form first.</p>
            <Link to="/pets" className="btn-primary">Browse Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-wrapper">
        <div className="confirmation-card">
          {/* Header with checkmark */}
          <div className="confirmation-header">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h1>Thank You!</h1>
            <p className="subtitle">Your adoption request has been submitted successfully.</p>
          </div>

          {/* Request Status */}
          <div className="status-section">
            <div className="status-badge">
              <FaClock className="status-icon" />
              <span className="status-label">Request Status</span>
              <span className={`status-value ${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
          </div>

          {/* Message based on status */}
          <div className="message-section">
            {request.status === "pending_approval" || request.status === "Pending" ? (
              <div className="message pending-message">
                <FaClock />
                <div className="message-content">
                  <h3>Your request is under review</h3>
                  <p>Our admin team is reviewing your application. This usually takes 24-48 hours.</p>
                  <p className="notification-note">You will be notified via email/SMS once approved.</p>
                </div>
              </div>
            ) : request.status === "Approved" ? (
              <div className="message approved-message">
                <FaCheck />
                <div className="message-content">
                  <h3>Congratulations! Your request has been approved!</h3>
                  <p>Please proceed to payment to complete your adoption.</p>
                  <button 
                    className="btn-primary payment-btn" 
                    onClick={() => navigate("/payment")}
                    style={{ marginTop: '15px' }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="message rejected-message">
                <FaTimes />
                <div className="message-content">
                  <h3>Your request was not approved</h3>
                  <p>Unfortunately, your adoption request was not approved at this time. Please contact us for more information.</p>
                </div>
              </div>
            )}
          </div>

          {/* Notification info */}
          <div className="notification-section">
            <FaEnvelope />
            <p>You will be notified once approved via email and SMS.</p>
          </div>

          {/* Pet Info */}
          {request.petName && (
            <div className="pet-info-section">
              <h3>Pet Information</h3>
              <div className="pet-details-card">
                <div className="pet-info-row">
                  <span className="label">Pet Name:</span>
                  <span className="value">{request.petName}</span>
                </div>
                <div className="pet-info-row">
                  <span className="label">Request Date:</span>
                  <span className="value">{new Date(request.date).toLocaleDateString()}</span>
                </div>
                <div className="pet-info-row">
                  <span className="label">Request ID:</span>
                  <span className="value">#{request.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="confirmation-actions">
            <Link to="/" className="btn-secondary">
              <FaHome /> Back to Home
            </Link>
            <Link to="/pets" className="btn-primary">
              Browse More Pets
            </Link>
          </div>

          {/* Refresh notice */}
          <div className="refresh-notice">
            <p>This page will automatically update when your status changes. You can also refresh the page to check for updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
