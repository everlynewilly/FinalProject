<?php
// Include centralized CORS configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/db.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['user_id']) || !isset($data['pet_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "user_id and pet_id are required"
    ]);
    exit;
}

$user_id = intval($data['user_id']);
$pet_id = intval($data['pet_id']);
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$residence = $data['residence'] ?? '';
$fenced_yard = $data['fenced_yard'] ?? '';
$pet_experience = $data['pet_experience'] ?? '';
$hours_alone = $data['hours_alone'] ?? '';
$travel_care = $data['travel_care'] ?? '';
$guarantor_name = $data['guarantor_name'] ?? '';
$guarantor_phone = $data['guarantor_phone'] ?? '';

// Check if screening_forms table has the required columns, add if not
try {
    // Check if user_id column exists
    $checkColumn = $conn->query("SHOW COLUMNS FROM screening_forms LIKE 'user_id'");
    if ($checkColumn->rowCount() == 0) {
        $conn->exec("ALTER TABLE screening_forms ADD COLUMN user_id INT DEFAULT NULL");
    }
    
    // Check if pet_id column exists
    $checkColumn = $conn->query("SHOW COLUMNS FROM screening_forms LIKE 'pet_id'");
    if ($checkColumn->rowCount() == 0) {
        $conn->exec("ALTER TABLE screening_forms ADD COLUMN pet_id INT DEFAULT NULL");
    }
    
    // Check if status column exists
    $checkColumn = $conn->query("SHOW COLUMNS FROM screening_forms LIKE 'status'");
    if ($checkColumn->rowCount() == 0) {
        $conn->exec("ALTER TABLE screening_forms ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
    }
} catch (PDOException $e) {
    // Continue even if alter fails - table might already have columns
}

// Insert the screening form using PDO
$stmt = $conn->prepare("INSERT INTO screening_forms 
    (user_id, pet_id, name, email, phone, residence, fenced_yard, pet_experience, hours_alone, travel_care, guarantor_name, guarantor_phone, status) 
    VALUES (:user_id, :pet_id, :name, :email, :phone, :residence, :fenced_yard, :pet_experience, :hours_alone, :travel_care, :guarantor_name, :guarantor_phone, 'pending')");

$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->bindParam(':pet_id', $pet_id, PDO::PARAM_INT);
$stmt->bindParam(':name', $name, PDO::PARAM_STR);
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
$stmt->bindParam(':residence', $residence, PDO::PARAM_STR);
$stmt->bindParam(':fenced_yard', $fenced_yard, PDO::PARAM_STR);
$stmt->bindParam(':pet_experience', $pet_experience, PDO::PARAM_STR);
$stmt->bindParam(':hours_alone', $hours_alone, PDO::PARAM_STR);
$stmt->bindParam(':travel_care', $travel_care, PDO::PARAM_STR);
$stmt->bindParam(':guarantor_name', $guarantor_name, PDO::PARAM_STR);
$stmt->bindParam(':guarantor_phone', $guarantor_phone, PDO::PARAM_STR);

if ($stmt->execute()) {
    $screening_id = $conn->lastInsertId();
    error_log("Screening submitted successfully. ID: $screening_id User: $user_id Pet: $pet_id"); 
    
    // Also create adoption request entry if table exists
    try {
        // Check if adoption_requests table exists
        $tableCheck = $conn->query("SHOW TABLES LIKE 'adoption_requests'");
        if ($tableCheck->rowCount() > 0) {
            // Check required columns
            $colCheck = $conn->query("SHOW COLUMNS FROM adoption_requests LIKE 'experience'");
            if ($colCheck->rowCount() == 0) {
                $conn->exec("ALTER TABLE adoption_requests ADD COLUMN experience TEXT");
            }
            
            $adoptionStmt = $conn->prepare("INSERT INTO adoption_requests 
                (user_id, pet_id, full_name, email, phone, residence, fenced_yard, owned_pets, experience, alone_hours, travel_care, guarantor_name, guarantor_phone, request_status) 
                VALUES (:user_id, :pet_id, :full_name, :email, :phone, :residence, :fenced_yard, :owned_pets, :experience, :alone_hours, :travel_care, :guarantor_name, :guarantor_phone, 'pending')");
            
            $ownedPets = '';
            $adoptionStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $adoptionStmt->bindParam(':pet_id', $pet_id, PDO::PARAM_INT);
            $adoptionStmt->bindParam(':full_name', $name, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':email', $email, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':phone', $phone, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':residence', $residence, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':fenced_yard', $fenced_yard, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':owned_pets', $ownedPets, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':experience', $pet_experience, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':alone_hours', $hours_alone, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':travel_care', $travel_care, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':guarantor_name', $guarantor_name, PDO::PARAM_STR);
            $adoptionStmt->bindParam(':guarantor_phone', $guarantor_phone, PDO::PARAM_STR);
            
            $adoptionStmt->execute();
            error_log("Adoption request created for screening $screening_id");
        } else {
            error_log("adoption_requests table missing, screening $screening_id created only");
        }
    } catch (Exception $e) {
        error_log("Failed to create adoption request for screening $screening_id: " . $e->getMessage());
    }
    
        // Send submission confirmation email
        try {
            require_once __DIR__ . '/../../config/mailer.php';
            $petStmt = $conn->query("SELECT name FROM pets WHERE id = $pet_id");
            $pet = $petStmt->fetch(PDO::FETCH_ASSOC);
            $pet_name = $pet ? $pet['name'] : 'your chosen pet';
            $emailSent = sendEmail($email, $name, 'Adoption Request Submitted - Awaiting Approval', 
                "<h2>Thank you for submitting your screening form!</h2><p>Dear $name,</p><p>Your request to adopt $pet_name has been submitted successfully (ID: $screening_id).</p><p>Our admin team will review it within 24-48 hours and notify you via email.</p><p>Best,<br>Pet Adoption Team");
            error_log("Submission email sent to $email: " . ($emailSent ? 'success' : 'failed'));
        } catch (Exception $e) {
            error_log("Email send failed in submit.php: " . $e->getMessage());
        }
        
        echo json_encode([
            "success" => true,
            "message" => "Screening form submitted successfully",
            "screening_id" => $screening_id
        ]);
} else {
    $errorInfo = $stmt->errorInfo();
    error_log("Screening insert failed: " . implode(' | ', $errorInfo));
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $errorInfo[2]
    ]);
}

$stmt->closeCursor();
$conn = null;
?>

