<?php
require_once __DIR__ . '/../api/cors.php';

// Include mailer functions
include __DIR__ . '/../config/mailer.php';

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['request_id'])) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

$request_id = intval($data['request_id']);

$stmt = $conn->prepare("
    SELECT ar.id, u.email, u.name, p.name AS pet_name
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



$email = $request['email'];
$name = $request['name'];
$pet_name = $request['pet_name'];

// Update status
$update = $conn->prepare("UPDATE adoption_requests SET request_status = 'approved' WHERE id = ?");
$update->execute([$request_id]);

// PAYMENT LINK - Updated button text in mailer.php
$payment_link = "http://localhost:5173/payment?request_id=" . $request_id;

// Send approval email using mailer function with HTML formatting
// Fetch real adoption fee from pet
$feeStmt = $conn->prepare("SELECT adoption_fee FROM pets p JOIN adoption_requests ar ON p.id = ar.pet_id WHERE ar.id = ?");
$feeStmt->execute([$request_id]);
$adoption_fee = $feeStmt->fetchColumn() ?: 5000;

$emailSent = sendApprovalEmail($email, $name, $pet_name, $request_id, $adoption_fee);

// Log email status for debugging
if ($emailSent) {
    error_log("Approval email sent successfully to: $email");
} else {
    error_log("FAILED to send approval email to: $email. Check PHP mail configuration.");
}

echo json_encode([
    "success" => true,
    "message" => "Adoption request approved",
    "email_sent" => $emailSent,
    "email_note" => $emailSent ? "Approval email sent to adopter" : "Email could not be sent. Please contact adopter directly."
]);

?>
