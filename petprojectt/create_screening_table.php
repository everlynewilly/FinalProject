<?php
require_once __DIR__ . '/config/db.php';

$sql = "CREATE TABLE IF NOT EXISTS screening_forms (
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
)";

if ($conn->query($sql) === TRUE) {
    echo "screening_forms table created or already exists successfully.";
} else {
    echo "Error creating table: " . implode(', ', $conn->errorInfo());
}


?>


