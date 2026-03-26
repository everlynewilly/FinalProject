<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../../config/db.php';

// Fetch all users
$sql = "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC";
$result = $conn->query($sql);

$users = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $users
]);
?>
