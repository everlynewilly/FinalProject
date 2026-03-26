// src/components/Admin.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaUsers,
  FaHome,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../assets/admin.css";
import apiService from "../services/api";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [stats, setStats] = useState({
    totalPets: 0,
    activeUsers: 0,
    adoptions: 0,
    pendingRequests: 0
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  useEffect(() => {
    if (activeTab === "dashboard" || activeTab === "requests") fetchScreeningRequests();
    if (activeTab === "pets") fetchPets();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  
  const fetchPets = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPets();
      setPets(data.map(pet => ({
        ...pet,
        image: pet.image_url || getDefaultImage(pet.species)
      })));
      setStats(prev => ({ ...prev, totalPets: data.length }));
    } catch (err) {
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const getDefaultImage = (species) => {
    if (species === "Cat") return "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop";
    if (species === "Dog") return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop";
    return "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop"; // default for other animals
  };

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await apiService.getUsers();
      setUsers(usersData || []);
      setStats(prev => ({ ...prev, activeUsers: (usersData || []).length }));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchScreeningRequests = async () => {
    setLoading(true);
    try {
      const apps = await apiService.getScreeningRequests();
      
      const applicationsArray = Array.isArray(apps) ? apps : (apps.applications || []);
      // Remove duplicates by id
      const uniqueApps = applicationsArray.filter((app, index, self) =>
         index === self.findIndex(t => t.id === app.id)
      );
      setAdoptionRequests(uniqueApps);
      setStats(prev => ({
        ...prev,
        pendingRequests: uniqueApps.filter(a => a.status === "pending").length,
        adoptions: uniqueApps.filter(a => a.status === "approved").length
      }));
    } catch (err) {
      console.error("Error fetching screening requests:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Approve / Reject adoption requests
  const handleApprove = async (id) => {
    try {
      const result = await apiService.approveScreening(id);
      if (result.success) {
        setAdoptionRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
        // Show email status
        if (result.email_sent) {
          alert("Screening approved! Approval email sent to adopter.");
        } else {
          alert("Screening approved, but email could not be sent. Please contact adopter directly.");
        }
      }
    } catch (err) {
      console.error("Error approving screening:", err);
      alert(`Approve failed: ${err.message || 'Server error. Check console.'}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await apiService.rejectScreening(id);
      if (result.success) {
        setAdoptionRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
        // Show email status
        if (result.email_sent) {
          alert("Screening rejected. Rejection email sent to adopter.");
        } else {
          alert("Screening rejected, but email could not be sent. Please contact adopter directly.");
        }
      }
    } catch (err) {
      console.error("Error rejecting screening:", err);
      alert(`Reject failed: ${err.message || 'Server error. Check console.'}`);
    }
  };

  // Delete Pet
  const handleDeletePet = (id) => {
    setPetToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    try {
      await apiService.deletePet(petToDelete);
      setPets(prev => prev.filter(p => p.id !== petToDelete));
      setShowDeleteModal(false);
      setPetToDelete(null);
    } catch (err) {
      console.error("Error deleting pet:", err);
    }
  };

  const cancelDeletePet = () => {
    setShowDeleteModal(false);
    setPetToDelete(null);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "Pending", class: "pending" },
      approved: { label: "Approved", class: "approved" },
      rejected: { label: "Rejected", class: "rejected" },
      available: { label: "Available", class: "available" },
      adopted: { label: "Adopted", class: "adopted" }
    };
    return <span className={`status ${map[status]?.class || "pending"}`}>{map[status]?.label || status}</span>;
  };

  const renderDeleteModal = () => showDeleteModal && (
    <div className="modal-overlay" onClick={cancelDeletePet}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this pet?</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={cancelDeletePet}>Cancel</button>
          <button className="modal-btn delete" onClick={confirmDeletePet}>Delete</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="admin-content">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.totalPets}</h3>
                <p>Total Pets</p>
              </div>
              <div className="stat-card">
                <h3>{stats.activeUsers}</h3>
                <p>Users</p>
              </div>
              <div className="stat-card">
                <h3>{stats.adoptions}</h3>
                <p>Adoptions</p>
              </div>
              <div className="stat-card">
                <h3>{stats.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
          </div>
        );
      case "pets":
        return (
          <div className="admin-content">
            <div className="content-header">
              <h2>Pet Management</h2>
<button className="btn-add" onClick={() => navigate("/add-pet")}><FaPlus /> Add Pet</button>
            </div>
            {loading ? <p>Loading...</p> : (
              <table className="pets-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Color</th>
                    <th>Temperament</th>
                    <th>Health</th>
                    <th>Location</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet.id}>
                      <td><img src={pet.image} alt={pet.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} /></td>
                      <td>{pet.name}</td>
                      <td>{pet.species}</td>
                      <td>{pet.breed}</td>
                      <td>{pet.gender}</td>
                      <td>{pet.age}</td>
                      <td>{pet.color}</td>
                      <td>{pet.temperament}</td>
                      <td>{pet.health}</td>
                      <td>{pet.location}</td>
<td>Ksh {pet.adoption_fee || '0'}</td>
                      <td>{getStatusBadge(pet.status)}</td>
                      <td>
                        <button className="action-btn edit"><FaEdit /></button>
                        <button className="action-btn delete" onClick={() => handleDeletePet(pet.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "users":
        return (
          <div className="admin-content">
            <h2>Registered Users</h2>
            {loading ? <p>Loading...</p> : (
              <table className="pets-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "requests":
        return (
          <div className="admin-content">
            <h2>Adoption Requests</h2>
            {loading ? <p>Loading...</p> : (
              <table className="pets-table">
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adoptionRequests.map(r => (
                    <tr key={r.id}>
                      <td>{r.petName}</td>
                      <td>{r.fullName}</td>
                      <td>{r.email}</td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td>
                        {r.status === "pending" && (
                          <>
                            <button className="action-btn approve" onClick={() => handleApprove(r.id)}><FaCheck /></button>
                            <button className="action-btn reject" onClick={() => handleReject(r.id)}><FaTimes /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header"><h2>🐾 PetAdopt</h2><p>Admin Panel</p></div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab("dashboard")}><FaChartBar /><span>Dashboard</span></button>
          <button className={`nav-item ${activeTab === 'pets' ? 'active' : ''}`} onClick={() => setActiveTab("pets")}><FaPaw /><span>Pets</span></button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab("users")}><FaUser /><span>Users</span></button>
          <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab("requests")}><FaClipboardList /><span>Requests</span></button>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="nav-item"><FaHome /><span>Home</span></Link>
          <button className="nav-item logout" onClick={handleLogout}><FaSignOutAlt /><span>Logout</span></button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header"><h1>{activeTab.toUpperCase()}</h1></header>
        {renderContent()}
        {renderDeleteModal()}
      </main>
    </div>
  );
}

export default Admin;
