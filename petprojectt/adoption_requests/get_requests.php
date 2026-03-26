<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../api/cors.php';

require_once __DIR__ . '/../config/db.php';

// Fetch all adoption requests with pet and user info
$sql = "SELECT 
    ar.id,
    ar.user_id,
    ar.pet_id,
    ar.request_status,
    ar.created_at,
    ar.full_name,
    ar.email,
    ar.phone,
    ar.residence,
    ar.fenced_yard,
    ar.owned_pets,
    ar.experience,
    ar.alone_hours,
    ar.travel_care,
    ar.guarantor_name,
    ar.guarantor_phone,
    u.name as user_name,
    u.email as user_email,
    p.name as pet_name,
    p.image as pet_image
FROM adoption_requests ar
JOIN users u ON ar.user_id = u.id
JOIN pets p ON ar.pet_id = p.id
ORDER BY ar.created_at DESC";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode([
        "success" => false,
        "message" => "Query failed"
    ]);
    exit();
}

$applications = [];

if ($result->rowCount() > 0) {
    while ($req = $result->fetch(PDO::FETCH_ASSOC)) {
        // Map image to full URL for frontend
$petImage = !empty($req['pet_image']) 
            ? '/petprojectt/uploads/' . $req['pet_image']
            : '/petprojectt/uploads/imageee.jpg';
        
        $applications[] = [
            'id' => $req['id'],
            'petId' => $req['pet_id'],
            'petName' => $req['pet_name'],
            'petImage' => $petImage,
            'userId' => $req['user_id'],
            'fullName' => $req['full_name'] ?? $req['user_name'],
            'email' => $req['email'] ?? $req['user_email'],
            'phone' => $req['phone'] ?? '',
            'residence' => $req['residence'] ?? '',
            'fencedYard' => $req['fenced_yard'] ?? '',
            'ownedPets' => $req['owned_pets'] ?? '',
            'experience' => $req['experience'] ?? '',
            'aloneHours' => $req['alone_hours'] ?? '',
            'travelCare' => $req['travel_care'] ?? '',
            'guarantorName' => $req['guarantor_name'] ?? '',
            'guarantorPhone' => $req['guarantor_phone'] ?? '',
            'status' => $req['request_status'],
            'date' => $req['created_at']
        ];
    }
}

echo json_encode([
    "success" => true,
    "applications" => $applications
]);

?>
