<?php
// ✅ CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../../config/db.php';
$config = require(__DIR__ . '/../../config/mpesa.php');

$log_file = __DIR__ . '/../../payments/payment_debug.log';
file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] API initiate_payment started\n", FILE_APPEND);

// ================= INPUT =================
$data = json_decode(file_get_contents("php://input"), true);
$request_id = $data['request_id'] ?? null;
$phone = $data['phone'] ?? null;
$amount = (int)($data['amount'] ?? 0);

if (!$request_id || !$phone || $amount <= 0) {
    $error = "Missing request_id, phone, or invalid amount";
    file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] ERROR: $error\n", FILE_APPEND);
    echo json_encode(["success" => false, "message" => $error]);
    exit;
}

file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] Input: request_id=$request_id, phone=$phone, amount=$amount\n", FILE_APPEND);

// ================= FETCH & VALIDATE =================
$stmt = $conn->prepare("
    SELECT ar.id, ar.request_status, u.phone as user_phone, p.adoption_fee
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

$status = strtolower(trim($request['request_status']));
$db_phone = preg_replace('/^\\+?254|^0/', '254', $request['user_phone']);
$db_amount = (int)$request['adoption_fee'];

file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] DB: phone=$db_phone, amount=$db_amount, status=$status\n", FILE_APPEND);

if ($status !== 'approved') {
    echo json_encode(["success" => false, "message" => "Request not approved (status: $status)"]);
    exit;
}

if ($phone !== $db_phone) {
    echo json_encode(["success" => false, "message" => "Phone does not match registered user phone"]);
    exit;
}

if ($amount !== $db_amount) {
    echo json_encode(["success" => false, "message" => "Amount mismatch"]);
    exit;
}

if ($status === 'paid') {
    echo json_encode(["success" => false, "message" => "Already paid"]);
    exit;
}

// ================= SAVE PAYMENT RECORD =================
$accountReference = "Adoption_" . $request_id;
$stmt = $conn->prepare("
    INSERT INTO payments (request_id, checkout_request_id, amount, status)
    VALUES (?, ?, ?, 'pending')
");
if (!$stmt->execute([$request_id, $accountReference, $amount])) {
    echo json_encode(["success" => false, "message" => "Failed to save payment record"]);
    exit;
}
file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] Payment record saved\n", FILE_APPEND);

// ================= TOKEN =================
$credentials = base64_encode($config['consumer_key'] . ":" . $config['consumer_secret']);
$ch = curl_init("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Basic $credentials"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response_raw = curl_exec($ch);
$response = json_decode($response_raw);

if (!isset($response->access_token)) {
    $error = "Token generation failed";
    file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] ERROR: $error\n", FILE_APPEND);
    echo json_encode(["success" => false, "message" => $error]);
    exit;
}

$access_token = $response->access_token;

// ================= STK PUSH =================
$timestamp = date("YmdHis");
$password = base64_encode($config['shortcode'] . $config['passkey'] . $timestamp);

$stkData = [
    "BusinessShortCode" => $config['shortcode'],
    "Password" => $password,
    "Timestamp" => $timestamp,
    "TransactionType" => "CustomerPayBillOnline",
    "Amount" => $amount,
    "PartyA" => $phone,
    "PartyB" => $config['shortcode'],
    "PhoneNumber" => $phone,
    "CallBackURL" => $config['callback_url'],
    "AccountReference" => $accountReference,
    "TransactionDesc" => "Payment for pet adoption"
];

$ch = curl_init("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($stkData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$stkResponse_raw = curl_exec($ch);
$stkResponse = json_decode($stkResponse_raw, true);

file_put_contents($log_file, "[" . date('Y-m-d H:i:s') . "] STK response: " . json_encode($stkResponse) . "\n", FILE_APPEND);

$debug_info = [
    'amount' => $amount,
    'phone' => $phone,
    'account_ref' => $accountReference,
    'response_code' => $stkResponse['ResponseCode'] ?? 'unknown'
];

echo json_encode([
    "success" => isset($stkResponse['ResponseCode']) && $stkResponse['ResponseCode'] == "0",
    "message" => $stkResponse['CustomerMessage'] ?? "STK Push initiated",
    "debug" => $debug_info
]);
?>

