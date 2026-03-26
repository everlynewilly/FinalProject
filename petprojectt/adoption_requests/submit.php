<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../api/cors.php';

require_once __DIR__ . '/../config/db.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['pet_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "user_id and pet_id are required"
    ]);
    exit;
}

$user_id = intval($data['user_id']);
$pet_id = intval($data['pet_id']);
$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$residence = $data['residence'] ?? '';
$fencedYard = $data['fencedYard'] ?? '';
$ownedPets = $data['ownedPets'] ?? '';
$experience = $data['experience'] ?? '';
$aloneHours = $data['aloneHours'] ?? '';
$travelCare = $data['travelCare'] ?? '';
$guarantorName = $data['guarantorName'] ?? '';
$guarantorPhone = $data['guarantorPhone'] ?? '';

// Insert the adoption request with all fields
$stmt = $conn->prepare("INSERT INTO adoption_requests 
    (user_id, pet_id, full_name, email, phone, residence, fenced_yard, owned_pets, experience, alone_hours, travel_care, guarantor_name, guarantor_phone, request_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");

if ($stmt->execute([$user_id, $pet_id, $fullName, $email, $phone, $residence, $fencedYard, $ownedPets, $experience, $aloneHours, $travelCare, $guarantorName, $guarantorPhone])) {
    $request_id = $conn->lastInsertId();
    echo json_encode([
        "success" => true,
        "message" => "Adoption request submitted successfully",
        "request_id" => $request_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error submitting request: " . implode(', ', $conn->errorInfo())
    ]);
}

?>
