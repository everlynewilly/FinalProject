 import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../assets/screening.css";

const Screening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Get petId from location state (passed from petdetails page)
  // Fall back to URL params if not available
  const petId = location.state?.petId || params.petId;
  
  const user = JSON.parse(localStorage.getItem("user"));

  // Show warning if accessed directly without selecting a pet
  useEffect(() => {
    if (!petId) {
      // Only show warning if we have rendered and still no petId
      const timer = setTimeout(() => {
        console.warn("Screening page accessed without selecting a pet. petId is missing.");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [petId]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    residence: "",
    fenced_yard: "",
    pet_experience: "",
    hours_alone: "",
    travel_care: "",
    guarantor_name: "",
    guarantor_phone: "",
    agreement: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if petId is available
    if (!petId) {
      alert("No pet selected. Please select a pet to adopt first.");
      navigate("/pets");
      return;
    }

    if (!formData.agreement) {
      alert("You must agree to the terms before submitting.");
      return;
    }

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user.id) {
      alert("You must be logged in to submit a screening form.");
      return;
    }

    const requestData = {
      user_id: user.id,
      pet_id: petId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      residence: formData.residence,
      fenced_yard: formData.fenced_yard,
      pet_experience: formData.pet_experience,
      hours_alone: formData.hours_alone,
      travel_care: formData.travel_care,
      guarantor_name: formData.guarantor_name,
      guarantor_phone: formData.guarantor_phone
    };

    try {
      // Use apiService which goes through the Vite proxy
      console.log("Submitting screening data...");
      console.log("Request data:", requestData);
      
      const data = await apiService.submitScreening({
        user_id: user.id,
        pet_id: petId,
        name: user.name || formData.name,
        email: user.email || formData.email,
        phone: formData.phone,
        residence: formData.residence,
        fenced_yard: formData.fenced_yard,
        pet_experience: formData.pet_experience,
        hours_alone: formData.hours_alone,
        travel_care: formData.travel_care,
        guarantor_name: formData.guarantor_name,
        guarantor_phone: formData.guarantor_phone
      });

      console.log("Response from server:", data);

      if (data.success) {
        alert(
"Your adoption request has been received. You will be notified via email after review."
        );
        // Optionally redirect to home or other page
        window.location.href = "/";
      } else {
        alert(data.message || "Failed to submit screening form");
      }
    } catch (error) {
      console.error("Error submitting screening:", error);
      alert("Failed to connect to the server. Please try again. Error: " + error.message);
    }
  };

  return (
    <div className="screening-container">
      <h2>Adopter Screening Form</h2>

      <form onSubmit={handleSubmit} className="screening-form">

        <div className="form-section">
          <h3>1. Personal Information</h3>
          
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>2. Living Situation</h3>

          <div className="form-group">
            <label>Residence</label>
            <select name="residence" onChange={handleChange} required>
              <option value="">Select Residence</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fenced Yard</label>
            <select name="fenced_yard" onChange={handleChange} required>
              <option value="">Fenced Yard</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>3. Pet Experience</h3>

          <div className="form-group">
            <label>Pet Experience</label>
            <textarea
              name="pet_experience"
              placeholder="Describe your pet experience"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hours Alone</label>
            <input
              type="number"
              name="hours_alone"
              placeholder="Hours pet will be alone"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>4. Travel Care</h3>

          <div className="form-group">
            <label>Travel Care</label>
            <textarea
              name="travel_care"
              placeholder="Who will care for pet when traveling"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>5. Guarantor Information</h3>

          <div className="form-group">
            <label>Guarantor Name</label>
            <input
              type="text"
              name="guarantor_name"
              placeholder="Enter guarantor name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Guarantor Phone</label>
            <input
              type="text"
              name="guarantor_phone"
              placeholder="Enter guarantor phone"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="agreement">
          <label>
            <input
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
            />
            I agree to provide proper care and allow home visits if needed.
          </label>
        </div>

        <button type="submit">
          Submit Screening
        </button>

      </form>
    </div>
  );
};

export default Screening;