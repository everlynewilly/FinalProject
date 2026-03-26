<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

function cleanupOrphanedImages($conn) {
    $upload_dir = __DIR__ . '/../../uploads/';
    
    $stmt = $conn->query("SELECT image FROM pets WHERE image != ''");
    $db_images = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    
    if (is_dir($upload_dir)) {
        $files = scandir($upload_dir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            if (!preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file)) continue;
            
            if (!in_array($file, $db_images)) {
                $file_path = $upload_dir . $file;
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }
        }
    }
}

$cleanup = $_GET['cleanup'] ?? '1';
if ($cleanup === '1') {
    cleanupOrphanedImages($conn);
}

$species = $_GET['species'] ?? '';
$breed = $_GET['breed'] ?? '';
$gender = $_GET['gender'] ?? '';

$sql = "SELECT * FROM pets WHERE 1=1";
$params = [];

if (!empty($species)) {
    $sql .= " AND species = ?";
    $params[] = $species;
}

if (!empty($breed)) {
    $sql .= " AND breed = ?";
    $params[] = $breed;
}

if (!empty($gender)) {
    $sql .= " AND gender = ?";
    $params[] = $gender;
}

$sql .= " ORDER BY id DESC";

$stmt = $conn->prepare($sql);
$stmt->execute($params);

$pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($pets as &$pet) {
    if (!empty($pet['image'])) {
$pet['image_url'] = '/uploads/' . $pet['image'];
    } else {
        $sp = strtolower($pet['species'] ?? '');
        if ($sp === 'cat') {
            $pet['image_url'] = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop';
        } elseif ($sp === 'dog') {
            $pet['image_url'] = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
        } else {
            $pet['image_url'] = 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=300&fit=crop';
        }
    }
}

echo json_encode([
    "success" => true,
    "data" => $pets
]);
?>

