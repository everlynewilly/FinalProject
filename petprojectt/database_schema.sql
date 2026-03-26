-- Database Schema for Pet Adoption System
-- Run this SQL to create/update the database tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS pet_adoption_system;
USE pet_adoption_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    role ENUM('admin', 'adopter') DEFAULT 'adopter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    description TEXT,
    status ENUM('available', 'adopted', 'pending') DEFAULT 'available',
    color VARCHAR(50),
    temperament VARCHAR(255),
    health TEXT,
    location VARCHAR(100),
    adoption_fee DECIMAL(10,2) DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adoption Requests table
CREATE TABLE IF NOT EXISTS adoption_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pet_id INT NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    residence VARCHAR(100),
    fenced_yard VARCHAR(50),
    owned_pets TEXT,
    experience TEXT,
    alone_hours VARCHAR(50),
    travel_care TEXT,
    guarantor_name VARCHAR(255),
    guarantor_phone VARCHAR(50),
    payment_id INT NULL,
    request_status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);

-- Screening Forms table
CREATE TABLE IF NOT EXISTS screening_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    pet_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    residence VARCHAR(100),
    fenced_yard VARCHAR(50),
    pet_experience TEXT,
    hours_alone VARCHAR(50),
    travel_care TEXT,
    guarantor_name VARCHAR(255),
    guarantor_phone VARCHAR(50),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT,
    checkout_request_id VARCHAR(100),
    amount DECIMAL(10,2),
    mpesa_code VARCHAR(50),
    status ENUM('pending','processing','success','failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES adoption_requests(id)
);

-- Insert sample admin user (password: admin)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@petadopt.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE name = 'Admin';

-- Sample pets
INSERT INTO pets (name, species, breed, age, gender, description, status, color, temperament, health, location, adoption_fee, image) VALUES
('Buddy', 'Dog', 'Golden Retriever', 3, 'Male', 'Friendly golden retriever', 'available', 'Golden', 'Friendly, Playful', 'Healthy', 'Nairobi', 5000, 'dog.jpeg'),
('Whiskers', 'Cat', 'Persian', 2, 'Female', 'Calm Persian cat', 'available', 'White', 'Calm', 'Healthy', 'Nairobi', 3000, 'cat.jpeg');
