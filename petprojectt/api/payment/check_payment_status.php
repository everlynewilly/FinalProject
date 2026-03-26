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
    SELECT ar.request_status, p.status as payment_status 
    FROM adoption_requests ar 
    LEFT JOIN payments p ON ar.id = p.request_id
    WHERE ar.id = ?
    ORDER BY p.id DESC LIMIT 1
");
$stmt->execute([$request_id]);

$request = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$request) {
    echo json_encode(["success" => false, "message" => "Request not found"]);
    exit;
}

echo json_encode([
    "success" => true,
    "data" => [
        "payment_status" => $request['payment_status'] ?? 'pending',
        "request_status" => $request['request_status']
    ]
]);