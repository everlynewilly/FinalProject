<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../../config/db.php';

$request_id = $_GET['request_id'] ?? null;

if (!$request_id) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT ar.id, ar.user_id, ar.pet_id, ar.request_status,
           u.name AS adopter_name, u.email,
           p.name AS pet_name, p.adoption_fee
    FROM adoption_requests ar
    JOIN users u ON ar.user_id = u.id
    JOIN pets p ON ar.pet_id = p.id
    WHERE ar.id = ?
");
$stmt->execute([$request_id]);

$request = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$request) {
    echo json_encode(["success" => false, "message" => "Request not found"]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => $request
]);