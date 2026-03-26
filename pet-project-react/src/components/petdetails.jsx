// src/components/petdetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import "../assets/petdetails.css";
import apiService from "../services/api";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiService.getPetById(id); // fetch single pet from API
        if (data) {
          setPet(data);
        } else {
          setError("Pet not found");
        }
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setError("Failed to load pet details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const getDefaultImage = (type) => {
    if (type === "Cat") return "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop";
    if (type === "Dog") return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop";
    return "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop"; // default for other animals
  };

  if (loading) {
    return <div className="pet-details-container"><p>Loading pet details...</p></div>;
  }

  if (error || !pet) {
    return (
      <div className="pet-details-container">
        <h2>{error || "Pet not found"}</h2>
        <Link to="/pets" className="btn-primary">
          Back to Pet List
        </Link>
      </div>
    );
  }

  return (
    <div className="pet-details-container">
      <div className="pet-details-wrapper">
        <Link to="/pets" className="back-link">
          <FaArrowLeft /> Back to Pet List
        </Link>

        <div className="pet-details-content">
          <div className="pet-details-image">
            <img src={pet.image_url || getDefaultImage(pet.species)} alt={pet.name} />
            <div className="pet-badge">{pet.species}</div>
          </div>

          <div className="pet-details-info">
            <div className="pet-header">
              <h1>{pet.name}</h1>
<span className="adoption-fee">Adoption Fee: Ksh {pet.adoption_fee || "Contact for fee"}</span>
            </div>

            <div className="pet-quick-info">
              <div className="info-item"><span className="label">Breed:</span> <span className="value">{pet.breed || "Unknown"}</span></div>
              <div className="info-item"><span className="label">Age:</span> <span className="value">{pet.age || "Not specified"}</span></div>
              <div className="info-item"><span className="label">Gender:</span> <span className="value">{pet.gender || "Not specified"}</span></div>
              <div className="info-item"><span className="label">Size:</span> <span className="value">{pet.size}</span></div>
              <div className="info-item"><span className="label">Color:</span> <span className="value">{pet.color || "Not specified"}</span></div>
              <div className="info-item"><span className="label">Location:</span> <span className="value">{pet.location || "Not provided"}</span></div>
            </div>

            <div className="pet-description">
              <h3>About {pet.name}</h3>
              <p>{pet.description || "No description available."}</p>
            </div>

            {pet.temperament && (
              <div className="pet-temperament">
                <h3>Temperament</h3>
                <div className="temperament-tags">
                  {pet.temperament.split(", ").map((trait, idx) => (
                    <span key={idx} className="tag">{trait}</span>
                  ))}
                </div>
              </div>
            )}

            {pet.health && (
              <div className="pet-health">
                <h3>Health Status</h3>
                <p>{pet.health}</p>
              </div>
            )}

            <div className="pet-actions">
              <Link
                to="/screening"
                state={{ petId: pet.id, petName: pet.name, adoptionFee: pet.adoption_fee }}
                className="btn-primary"
              >
                <FaHeart style={{ marginRight: "0.5rem" }} /> Adopt {pet.name}
              </Link>
              <Link to="/pets" className="btn-secondary">Browse More Pets</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetails;