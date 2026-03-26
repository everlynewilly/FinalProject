<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../../config/db.php';

// Get pet ID from query parameter
$pet_id = $_GET['id'] ?? null;

if (!$pet_id) {
    echo json_encode([
        "success" => false,
        "message" => "Pet ID is required"
    ]);
    exit();
}

// Fetch single pet
$stmt = $conn->prepare("SELECT * FROM pets WHERE id = ?");
$stmt->execute([$pet_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    // Map image to image_url for frontend compatibility with full URL
    // Use species-based default images if no image is set
    if (isset($row['image']) && !empty($row['image'])) {
$row['image_url'] = '/uploads/' . $row['image'];
    } else {
        // Use species-based default images
        $species = strtolower($row['species'] ?? '');
        if ($species === 'cat') {
            $row['image_url'] = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop';
        } elseif ($species === 'dog') {
            $row['image_url'] = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
        } else {
            // Default for other animals
            $row['image_url'] = 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop';
        }
    }
    echo json_encode([
        "success" => true,
        "data" => $row
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Pet not found"
    ]);
}

?>
