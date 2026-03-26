<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get POST data safely
    $name = $_POST['name'] ?? '';
    $species = $_POST['species'] ?? '';
    $breed = $_POST['breed'] ?? '';
    $age = $_POST['age'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $description = $_POST['description'] ?? '';
    $status = $_POST['status'] ?? 'available';
    $color = $_POST['color'] ?? '';
    $temperament = $_POST['temperament'] ?? '';
    $health = $_POST['health'] ?? '';
    $location = $_POST['location'] ?? '';
    $adoption_fee = $_POST['adoption_fee'] ?? 0;

    $image = ''; // Default to no image
    $uploaded_file_path = ''; // Track the uploaded file path for cleanup

    // Handle image upload - validate first but don't save yet
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $img_name = time() . '_' . basename($_FILES['image']['name']);
        $target_dir = '../../uploads/'; // make sure this folder exists
        $target_file = $target_dir . $img_name;

        // Validate file type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $file_type = $_FILES['image']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            $response['message'] = "Invalid image type. Allowed types: JPEG, PNG, GIF, WebP.";
            echo json_encode($response);
            exit;
        }

        // Validate file size (max 5MB)
        if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
            $response['message'] = "Image size too large. Maximum size is 5MB.";
            echo json_encode($response);
            exit;
        }

        // Move uploaded file to temporary location first
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $response['message'] = "Failed to upload image.";
            echo json_encode($response);
            exit;
        }

        $image = $img_name;
        $uploaded_file_path = $target_file;
    } else {
        $image = ''; // no image uploaded
    }

    // PDO prepared statement
    $sql = "INSERT INTO pets 
        (name, species, breed, age, gender, description, image, status, color, temperament, health, location, adoption_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $params = [$name, $species, $breed, $age, $gender, $description, $image, $status, $color, $temperament, $health, $location, (float)$adoption_fee];

    $stmt = $conn->prepare($sql);
    if ($stmt->execute($params)) {
        $response['success'] = true;
        $response['message'] = "Pet added successfully";
    } else {
        // If database insert fails, delete the uploaded image
        if (!empty($uploaded_file_path) && file_exists($uploaded_file_path)) {
            unlink($uploaded_file_path);
        }
        $response['message'] = "Database error: " . implode(', ', $stmt->errorInfo());
    }
} else {
    $response['message'] = "Invalid request method.";
}

echo json_encode($response);
?>

