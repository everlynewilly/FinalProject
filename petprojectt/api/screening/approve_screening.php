<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

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
    // Update the screening form status to approved
$sql = "UPDATE screening_forms SET status = 'approved' WHERE id = :id";
    $stmt = $conn->prepare($sql);

    // Get screening details for email
    $screeningStmt = $conn->prepare("SELECT sf.*, u.name, p.name AS pet_name FROM screening_forms sf JOIN users u ON sf.user_id = u.id JOIN pets p ON sf.pet_id = p.id WHERE sf.id = :id");
    $screeningStmt->execute([':id' => $screening_id]);
    $screening = $screeningStmt->fetch(PDO::FETCH_ASSOC);

    // Update corresponding adoption request status if exists
    $adoptUpdate = $conn->prepare("UPDATE adoption_requests SET request_status = 'approved' WHERE user_id = (SELECT user_id FROM screening_forms WHERE id = :id) AND pet_id = (SELECT pet_id FROM screening_forms WHERE id = :id) LIMIT 1");
    $adoptUpdate->execute([':id' => $screening_id]);
    $stmt->execute([':id' => $screening_id]);

    if ($stmt->rowCount() > 0) {
        // Send approval email with Pay Now button
        require_once __DIR__ . '/../../config/mailer.php';
$petFeeStmt = $conn->prepare("SELECT adoption_fee FROM pets WHERE id = :pet_id");
        $petFeeStmt->execute([':pet_id' => $screening['pet_id']]);
        $fee = (float)$petFeeStmt->fetchColumn() ?: 0;
        if ($fee <= 0) $fee = 5000; // fallback
        
        $emailSent = @sendApprovalEmail($screening['email'], $screening['name'], $screening['pet_name'], $screening_id, $fee) || false;

        echo json_encode([
            "success" => true,
            "message" => "Screening approved" . ($emailSent ? " & email sent" : ""),
            "email_sent" => $emailSent
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Screening request not found"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>

