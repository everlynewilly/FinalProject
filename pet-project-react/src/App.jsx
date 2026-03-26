import React, { useState, useContext, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import PetList from "./components/petlist";
import PetDetails from "./components/petdetails";
import Screening from "./components/screening";
import Payment from "./components/payment";
import Admin from "./components/admin";
import AddPet from "./components/add-pet";
import About from "./components/about";
import AdoptionSuccess from "./components/adoption-success";
import Confirmation from "./components/confirmation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pets" element={<PetList />} />
              <Route path="/pet/:id" element={<PetDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/screening" element={<Screening />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/adoption-success" element={<AdoptionSuccess />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-pet"
                element={
                  <ProtectedRoute>
                    <AddPet />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
