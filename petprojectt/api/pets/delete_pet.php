<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$pet_id = $data['id'] ?? null;

if (!$pet_id) {
    echo json_encode([
        "success" => false,
        "message" => "Pet ID is required"
    ]);
    exit();
}

// Delete pet
$stmt = $conn->prepare("DELETE FROM pets WHERE id = ?");
$stmt->execute([$pet_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Pet deleted successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete pet"
    ]);
}

?>
