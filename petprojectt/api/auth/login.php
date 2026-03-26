<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

// Database connection loaded from config/db.php

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$expected_role = $data['role'] ?? '';

if (empty($email) || empty($password) || empty($expected_role)) {
    echo json_encode(["success" => false, "message" => "Email, password, and role selection required"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    if (password_verify($password, $user['password'])) {
    if (!in_array($expected_role, ['admin', 'adopter'])) {
        echo json_encode(["success" => false, "message" => "Invalid role specified"]);
        exit();
    }
    if ($user['role'] !== $expected_role) {
        echo json_encode(["success" => false, "message" => "Invalid credentials for selected role. Please use correct account type."]);
        exit();
    }
        // Generate a simple token
        $token = bin2hex(random_bytes(32));
        
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
?>
