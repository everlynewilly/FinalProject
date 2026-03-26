<?php
/**
 * Fix script to update database for payment functionality
 * Run this file once to add 'paid' status to adoption_requests table
 */

header('Content-Type: application/json');

include "config/db.php";

try {
    // 1. Ensure 'paid' status exists (existing logic)
    $stmt = $conn->query("SHOW COLUMNS FROM adoption_requests LIKE 'request_status'");
    $column = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($column && strpos($column['Type'], 'paid') === false){
        $conn->exec("ALTER TABLE adoption_requests MODIFY COLUMN request_status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending'");
        echo json_encode(["success" => true, "message" => "Added 'paid' status to request_status"]);
    }

    // 2. Ensure pets have adoption_fee (existing logic)
    $stmt = $conn->query("SELECT COUNT(*) as count FROM pets WHERE adoption_fee IS NULL OR adoption_fee = 0");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if($result['count'] > 0){
        $conn->exec("UPDATE pets SET adoption_fee = 3000 WHERE adoption_fee IS NULL OR adoption_fee = 0");
        echo json_encode(["success" => true, "message" => "Set default adoption fees"]);
    }

    // 3. NEW: Create payments tracking table
    $tableCheck = $conn->query("SHOW TABLES LIKE 'payments'");
    if($tableCheck->rowCount() == 0){
        $conn->exec("
            CREATE TABLE payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id INT NOT NULL,
                checkout_request_id VARCHAR(50) UNIQUE NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                mpesa_code VARCHAR(50),
                status ENUM('pending','processing','success','failed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (request_id) REFERENCES adoption_requests(id) ON DELETE CASCADE
            )
        ");
        echo json_encode(["success" => true, "message" => "Created payments tracking table"]);
    }

    // 4. NEW: Add payment_id FK to adoption_requests (if not exists)
    $fkCheck = $conn->query("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME='adoption_requests' AND COLUMN_NAME='payment_id' AND TABLE_SCHEMA=DATABASE()");
    if($fkCheck->rowCount() == 0){
        $conn->exec("ALTER TABLE adoption_requests ADD COLUMN payment_id INT NULL");
        $conn->exec("ALTER TABLE adoption_requests ADD FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL");
        echo json_encode(["success" => true, "message" => "Added payment_id to adoption_requests"]);
    }

    echo json_encode(["success" => true, "message" => "✅ Payment DB fully prepared!"]);

} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>

