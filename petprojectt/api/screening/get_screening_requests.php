<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

// Get status filter from query string
$status = isset($_GET['status']) ? $_GET['status'] : 'pending';

try {
    // Fetch screening forms with pet and user info
    $sql = "SELECT 
        sf.id,
        sf.user_id,
        sf.pet_id,
        sf.name,
        sf.email,
        sf.phone,
        sf.residence,
        sf.fenced_yard,
        sf.pet_experience,
        sf.hours_alone,
        sf.travel_care,
        sf.guarantor_name,
        sf.guarantor_phone,
        sf.status,
        sf.created_at,
        u.name as user_name,
        u.email as user_email,
        p.name as pet_name,
        p.image as pet_image,
        p.adoption_fee
    FROM screening_forms sf
    LEFT JOIN users u ON sf.user_id = u.id
    LEFT JOIN pets p ON sf.pet_id = p.id
    WHERE sf.status = :status
    ORDER BY sf.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':status' => $status]);

    $applications = [];

    while ($req = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Map image to full URL for frontend
        $petImage = !empty($req['pet_image']) 
            ? 'http://localhost/pet%20project/petprojectt/uploads/' . $req['pet_image']
            : 'http://localhost/pet%20project/petprojectt/uploads/imageee.jpg';
        
        $applications[] = [
            'id' => $req['id'],
            'screeningId' => $req['id'],
            'petId' => $req['pet_id'],
            'petName' => $req['pet_name'] ?? 'Unknown Pet',
            'petImage' => $petImage,
            'adoptionFee' => $req['adoption_fee'] ?? 0,
            'userId' => $req['user_id'],
            'fullName' => $req['name'],
            'email' => $req['email'],
            'phone' => $req['phone'] ?? '',
            'residence' => $req['residence'] ?? '',
            'fencedYard' => $req['fenced_yard'] ?? '',
            'petExperience' => $req['pet_experience'] ?? '',
            'hoursAlone' => $req['hours_alone'] ?? '',
            'travelCare' => $req['travel_care'] ?? '',
            'guarantorName' => $req['guarantor_name'] ?? '',
            'guarantorPhone' => $req['guarantor_phone'] ?? '',
            'status' => $req['status'],
            'date' => $req['created_at']
        ];
    }

    echo json_encode([
        "success" => true,
        "applications" => $applications
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Query failed",
        "error" => $e->getMessage()
    ]);
}
?>

