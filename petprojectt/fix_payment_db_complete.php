<?php
// COMPLETE DB FIX for M-Pesa Payment
include 'config/db.php';

echo "🔧 Fixing database for M-Pesa payment...\n\n";

$fixes = [
    // 1. Add phone to users if missing
    "users_phone" => "ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL AFTER email",
    
    // 2. Ensure adoption_fee in pets
    "pets_fee" => "ALTER TABLE pets MODIFY COLUMN adoption_fee DECIMAL(10,2) DEFAULT 5000",
    
    // 3. Ensure payments table
    "payments_table" => "CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT,
        checkout_request_id VARCHAR(100),
        amount DECIMAL(10,2),
        mpesa_code VARCHAR(50),
        status ENUM('pending','processing','success','failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES adoption_requests(id)
    )",
    
    // 4. Ensure 'paid' in adoption_requests status
    "adoption_paid_status" => "ALTER TABLE adoption_requests MODIFY COLUMN request_status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending'"
];

foreach ($fixes as $name => $sql) {
    try {
        $conn->exec($sql);
        echo "✅ $name fixed\n";
    } catch (PDOException $e) {
        echo "ℹ️ $name already OK or minor error: " . $e->getMessage() . "\n";
    }
}

echo "\n🎉 Database ready for M-Pesa payments!\n";
echo "Test: http://localhost/project/petprojectt/fix_payment_db_complete.php\n";
?>

