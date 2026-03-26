<?php
// One-time user creation script for vmutheu865@gmail.com
// Run once: http://localhost/project/petprojectt/api/auth/create_user.php
// Then delete this file

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

$email = 'vmutheu865@gmail.com';
$password = 'aecoyuhwbsnlcbxf';
$name = 'Test User';
$role = 'adopter';

if (empty($email) || empty($password) || empty($name)) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit();
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "User already exists"]);
    exit();
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
$result = $stmt->execute([$name, $email, $hashedPassword, $role]);

if ($result) {
    echo json_encode([
        "success" => true, 
        "message" => "User created successfully! Password: $password (keep safe)",
        "user" => ["email" => $email, "role" => $role]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to create user"]);
}
?>

