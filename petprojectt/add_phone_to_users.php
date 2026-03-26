<?php
// Fix DB: Add phone to users table if missing
include 'config/db.php';

$check = $conn->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
if (!in_array('phone', $check)) {
    $conn->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL AFTER email");
    echo "✅ Added 'phone' column to users table\n";
} else {
    echo "ℹ️ 'phone' column already exists\n";
}

echo "Run: http://localhost/project/petprojectt/add_phone_to_users.php";
?>

