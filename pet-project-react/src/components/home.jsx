// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaHeart, FaHome } from "react-icons/fa";
import "../assets/home.css";
import apiService from "../services/api";

function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedPets();
  }, []);

  const fetchFeaturedPets = async () => {
    setLoading(true);
    try {
      // Try fetching from backend API
      const pets = await apiService.getPets();
      if (Array.isArray(pets) && pets.length > 0) {
        setFeaturedPets(pets.slice(0, 3)); // Show first 3 as featured
      } else {
        throw new Error("No pets returned from API");
      }
    } catch (err) {
      console.error("Failed to fetch pets from API:", err);
      setError("Failed to load featured pets. Please refresh the page or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaPaw />,
      title: "Find Your Match",
      description:
        "Browse through hundreds of pets waiting for their forever homes.",
    },
    {
      icon: <FaHeart />,
      title: "Easy Adoption",
      description:
        "Our simple screening process ensures the best match for you and your new pet.",
    },
    {
      icon: <FaHome />,
      title: "Give Love",
      description:
        "Provide a loving home to animals in need and change a life forever.",
    },
  ];

  // const getDefaultImage = (species) => { // disabled for real image testing
    // return species === "Cat"
      // ? "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop"
      // : "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop";
  // };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to PetAdopt</h1>
          <p>Find your perfect furry companion today</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose PetAdopt?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="featured-pets">
        <h2>Featured Pets</h2>
        <p className="section-subtitle">
          Meet some of our adorable friends waiting for their forever homes
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading pets...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            <p>{error}</p>
          </div>
        ) : (
          <div className="pets-showcase">
            {featuredPets.map((pet) => (
              <Link
                key={pet.id}
                to={`/pet/${pet.id}`}
                className="pet-showcase-card"
              >
                <img
                  src={pet.image_url || getDefaultImage(pet.species)}
                  alt={pet.name}
                  // onError={(e) => {
                    // e.target.src = getDefaultImage(pet.species);
                  // }} // disabled for real image testing
                />
                <div className="pet-info">
                  <h4>{pet.name}</h4>
                  <p>{pet.breed}</p>
                  <p>
                    {pet.age} years old • {pet.gender}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Adopt?</h2>
        <p>Take the first step towards finding your new best friend</p>
        
      </section>
    </div>
  );
}

export default Home;