<?php
require_once __DIR__ . '/config/db.php';

$sql = "CREATE TABLE IF NOT EXISTS pets (
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
)";

if ($conn->query($sql) === TRUE) {
    echo "pets table created or already exists successfully.";
} else {
    echo "Error creating table: " . $conn->error;
}


?>

