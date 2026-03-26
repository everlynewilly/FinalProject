// src/components/petlist.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaEye } from "react-icons/fa";
import "../assets/petlist.css";
import apiService from "../services/api";

function Petlist() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    gender: ""
  });

  const dogBreeds = ["Golden Retriever", "Labrador", "German Shepherd", "Bulldog", "Beagle", "Poodle", "Rottweiler", "Boxer"];
  const catBreeds = ["Persian", "Siamese", "Maine Coon", "British Shorthair", "Ragdoll", "Bengal"];
  const birdBreeds = ["Parrot", "Canary", "Sparrow", "Finch"];
  const rabbitBreeds = ["Holland Lop", "Netherland Dwarf", "Lionhead", "Chinchilla"];

  useEffect(() => {
    fetchPets();
  }, []); // initial load

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPets(filters); // ensure apiService.getPets returns an array of pets
      setPets(data || []);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to load pets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "species") {
      setFilters(prev => ({
        ...prev,
        species: value,
        breed: "" // reset breed if species changes
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    fetchPets();
  };

  const getBreedOptions = () => {
    if (filters.species === "Dog") return dogBreeds;
    if (filters.species === "Cat") return catBreeds;
    if (filters.species === "Bird") return birdBreeds;
    if (filters.species === "Rabbit") return rabbitBreeds;
    return [...dogBreeds, ...catBreeds, ...birdBreeds, ...rabbitBreeds];
  };

  const filteredPets = pets.filter(pet => {
    const term = searchTerm.toLowerCase();
    return (
      pet.name?.toLowerCase().includes(term) ||
      pet.breed?.toLowerCase().includes(term) ||
      pet.species?.toLowerCase().includes(term)
    );
  });

const getDefaultImage = (pet) => {
  const hash = (pet.id || 0) % 5;
  const catImages = [
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300",
    "https://images.unsplash.com/photo-1606780745061-9a2fd8140a8a?w=400&h=300"
  ];
  const dogImages = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300"
  ];
  const otherImages = [
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300"
  ];
  switch(pet.species?.toLowerCase()) {
    case 'cat': return catImages[hash % catImages.length];
    case 'dog': return dogImages[hash % dogImages.length];
    default: return otherImages[hash % otherImages.length];
  }
};



  return (
    <div className="petlist-page">
      {/* Filters Sidebar */}
      <aside className="filters-sidebar">
        <h3><FaFilter style={{ marginRight: '0.5rem' }} />Filters</h3>

        <label>Species</label>
        <select name="species" value={filters.species} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Other">Other</option>  
        </select>

        <label>Breed</label>
        <select name="breed" value={filters.breed} onChange={handleFilterChange}>
          <option value="">Any</option>
          {getBreedOptions().map(breed => <option key={breed} value={breed}>{breed}</option>)}
        </select>

        <label>Gender</label>
        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button className="filter-btn" onClick={applyFilters}>
          <FaFilter style={{ marginRight: '0.5rem' }} /> Apply Filters
        </button>
      </aside>

      {/* Pets Section */}
      <section className="pets-section">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search pets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-message">Loading pets...</div>
        ) : error ? (
          <div className="error-message">
            {error}
            <button onClick={fetchPets} className="filter-btn">Retry</button>
          </div>
        ) : (
          <div className="pets-grid">
            {filteredPets.length ? filteredPets.map(pet => (
              <div key={pet.id} className="pet-card">
                <div className="pet-image-container">
                  <img
                    src={pet.image_url || getDefaultImage(pet)}
                    alt={pet.name}
                    onError={e => { e.target.src = getDefaultImage(pet); e.target.onerror = null; }}
                  />
                  <div className="pet-type-badge">{pet.species}</div>
                </div>

                <div className="pet-info-container">
                  <h4>{pet.name}</h4>
                  <p className="pet-breed">{pet.breed || 'Mixed'}</p>
                  <p className="pet-age">{pet.age || '?'} years • {pet.gender || 'Unknown'}</p>
<p className="pet-size">{pet.size || 'Unknown'}</p>
                  <p className="pet-fee">Ksh {pet.adoption_fee || '0'}</p>

                  <Link to={`/pet/${pet.id}`} className="view-details-btn">
                    <FaEye style={{ marginRight: '0.5rem' }} /> View Details
                  </Link>
                </div>
              </div>
            )) : (
              <div className="no-pets-message">
                No pets found matching your criteria. Try adjusting filters or search.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Petlist;
