// src/AddPet.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../assets/admin.css";

const AddPet = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "Male",
    description: "",
    status: "available",
    color: "",
    temperament: "",
    health: "",
    location: "",
    adoption_fee: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Create FormData for file upload
    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      const result = await apiService.addPet(data);
      
      if (result.success) {
        setMessage("Pet added successfully!");
        setTimeout(() => {
          navigate("/admin"); // redirect to admin page
        }, 1500);
      } else {
        setMessage("Error: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="add-pet-form">
        <h2>Add New Pet</h2>
        {message && <p className={message.includes("success") ? "success-msg" : "error-msg"}>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Pet Name *</label>
          <input type="text" name="name" placeholder="Pet Name" onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Species *</label>
            <select name="species" onChange={handleChange} required>
              <option value="">Select Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Breed *</label>
            <input type="text" name="breed" placeholder="Breed" onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age *</label>
            <input type="number" name="age" placeholder="Age (years)" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" onChange={handleChange} value={formData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" placeholder="Pet description" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Color</label>
            <input type="text" name="color" placeholder="Color" onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Temperament</label>
            <input type="text" name="temperament" placeholder="Temperament" onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Health Status</label>
            <input type="text" name="health" placeholder="Health status" onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" placeholder="Location" onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Adoption Fee ($)</label>
          <input type="number" name="adoption_fee" placeholder="Adoption Fee" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" onChange={handleChange} value={formData.status}>
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="form-group">
          <label>Pet Image *</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Adding Pet..." : "Add Pet"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddPet;
