import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaPaw, FaHandsHelping, FaStar } from "react-icons/fa";
import "../assets/about.css";

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About PetAdopt</h1>
          <p className="about-hero-subtitle">
            Connecting loving families with pets who need a forever home
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-section">
        <div className="about-container">
          <h2>Our Story</h2>
          <div className="about-story">
            <div className="about-story-content">
              <p>
                PetAdopt was born from a simple belief: every pet deserves a loving home, 
                and every family deserves the joy of pet ownership. Founded in 2020, we 
                started as a small team of animal lovers who saw firsthand the number of 
                pets waiting in shelters for their forever families.
              </p>
              <p>
                What began as a passion project has grown into a community of thousands of 
                adopters, volunteers, and shelter partners who share our mission. We've 
                helped over <strong>100 pets</strong> find their perfect matches, and 
                we're just getting started.
              </p>
              <p>
                Our platform bridges the gap between pets in need and families ready to 
                welcome a new furry member. We believe that the right match benefits 
                everyone—the pet, the family, and the entire community.
              </p>
            </div>
            <div className="about-story-image">
              <div className="about-image-placeholder">
                <FaPaw className="about-placeholder-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="about-mission-grid">
            <div className="about-mission-card">
              <div className="about-mission-icon">
                <FaHeart />
              </div>
              <h3>Our Mission</h3>
              <p>
                To create meaningful connections between pets and people, ensuring 
                every animal finds a loving home and every family finds their perfect 
                companion.
              </p>
            </div>
            <div className="about-mission-card">
              <div className="about-mission-icon">
                <FaStar />
              </div>
              <h3>Our Vision</h3>
              <p>
                A world where every pet has a home, and every home has the opportunity 
                to experience the unconditional love that comes with pet adoption.
              </p>
            </div>
            <div className="about-mission-card">
              <div className="about-mission-icon">
                <FaHandsHelping />
              </div>
              <h3>Our Values</h3>
              <p>
                Compassion, transparency, and responsible pet ownership guide everything 
                we do. We treat every animal with dignity and respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-container">
          <h2>Join Our Mission</h2>
          <p>
            Whether you're looking to adopt, volunteer, or donate, there are many ways 
            to make a difference in the lives of animals in need.
          </p>
          <div className="about-cta-buttons">
            <Link to="/register" className="about-btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
