<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../../config/db.php';

$request_id = $_GET['request_id'] ?? null;

if (!$request_id) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT * FROM payments 
    WHERE request_id = ?
    ORDER BY id DESC LIMIT 1
");
$stmt->execute([$request_id]);

$payment = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$payment) {
    echo json_encode(["success" => false, "message" => "Payment not found"]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => $payment
]);