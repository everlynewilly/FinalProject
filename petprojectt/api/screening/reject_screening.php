<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/mailer.php';
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$screening_id = isset($data['screening_id']) ? intval($data['screening_id']) : 0;

if (!$screening_id) {
    echo json_encode([
        "success" => false,
        "message" => "Screening ID is required"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT user_id, name, email FROM screening_forms WHERE id = ?");
    $stmt->execute([$screening_id]);
    $screening = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$screening) {
        echo json_encode(["success" => false, "message" => "Screening not found"]);
        exit;
    }

    // Update status
    $update = $conn->prepare("UPDATE screening_forms SET status = 'rejected' WHERE id = ?");
    $update->execute([$screening_id]);

    // Send rejection email
    $emailSent = @sendRejectionEmail($screening['email'], $screening['name'], 'your requested pet') || false;
    
    echo json_encode([
        "success" => true,
        "message" => "Screening rejected" . ($emailSent ? "" : " (email failed silently)"),
        "email_sent" => $emailSent
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

