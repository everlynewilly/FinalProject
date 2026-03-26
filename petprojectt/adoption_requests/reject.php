<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../api/cors.php';

// Include mailer functions
include __DIR__ . '/../config/mailer.php';

// Include database connection (PDO)
require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['request_id'])) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

$request_id = intval($data['request_id']);

try {
    // Get adopter info before rejection
    $stmt = $conn->prepare("
        SELECT u.email, u.name, p.name AS pet_name
        FROM adoption_requests ar
        JOIN users u ON ar.user_id = u.id
        JOIN pets p ON ar.pet_id = p.id
        WHERE ar.id = :request_id
    ");
    $stmt->execute([':request_id' => $request_id]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        echo json_encode(["success" => false, "message" => "Request not found"]);
        exit;
    }

    $email = $request['email'];
    $name = $request['name'];
    $pet_name = $request['pet_name'];

    // Update status to rejected
    $update = $conn->prepare("
        UPDATE adoption_requests 
        SET request_status = 'rejected' 
        WHERE id = :request_id
    ");
    $update->execute([':request_id' => $request_id]);

    if ($update->rowCount() > 0) {
        // Send rejection email
        $emailSent = sendRejectionEmail($email, $name, $pet_name);

        // Log email status
        if ($emailSent) {
            error_log("Rejection email sent to: $email");
        } else {
            error_log("FAILED to send rejection email to: $email");
        }

        echo json_encode([
            "success" => true,
            "message" => "Adoption request rejected",
            "email_sent" => $emailSent,
            "email_note" => $emailSent ? "Rejection email sent to adopter" : "Email could not be sent. Please contact adopter directly."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to reject request"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}

// Clean up PDO objects
$stmt = null;
$update = null;
$conn = null;
?>  