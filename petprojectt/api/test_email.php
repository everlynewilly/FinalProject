<?php
require_once '../config/mailer.php';

$result = sendApprovalEmail('test@example.com', 'Test User', 'Buddy', 1, 5000);
echo "Email result: " . ($result ? 'SENT' : 'FAILED');
?>

