<?php
header('Content-Type: application/json');

require_once '../config/db.php';

$callbackData = json_decode(file_get_contents('php://input'), true);

file_put_contents("callback_log.txt", "[" . date('Y-m-d H:i:s') . "] " . json_encode($callbackData) . "\n", FILE_APPEND);

$resultCode = $callbackData['Body']['stkCallback']['ResultCode'] ?? 1;

if ($resultCode === 0) {
    // Success - extract metadata
    $items = $callbackData['Body']['stkCallback']['CallbackMetadata']['Item'] ?? [];
    $accountRef = null;
    $mpesaReceipt = null;
    $amount = 0;

    foreach ($items as $item) {
        switch ($item['Name']) {
            case 'AccountReference': $accountRef = $item['Value']; break;
            case 'MpesaReceiptNumber': $mpesaReceipt = $item['Value']; break;
            case 'Amount': $amount = $item['Value']; break;
        }
    }

    preg_match('/Adoption_(\d+)/', $accountRef ?? '', $matches);
    $request_id = $matches[1] ?? null;

    if ($request_id && $mpesaReceipt) {
        // Update payments table with success and receipt
        $stmt = $conn->prepare("UPDATE payments SET status='success', mpesa_code=? WHERE checkout_request_id=?");
        $stmt->execute([$mpesaReceipt, $accountRef]);
        
        // Update adoption request status
        $conn->prepare("UPDATE adoption_requests SET request_status='paid' WHERE id=?")->execute([$request_id]);
        
        // Mark pet as adopted
        $conn->prepare("UPDATE pets SET status='adopted' WHERE id = (SELECT pet_id FROM adoption_requests WHERE id=?)")->execute([$request_id]);
        
        // Send confirmation email
        $emailStmt = $conn->prepare("
            SELECT u.name, u.email, p.name as pet_name 
            FROM adoption_requests ar 
            JOIN users u ON ar.user_id = u.id 
            JOIN pets p ON ar.pet_id = p.id 
            WHERE ar.id = ?
        ");
        $emailStmt->execute([$request_id]);
        $user = $emailStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            require_once '../config/mailer.php';
            sendPaymentConfirmationEmail($user['email'], $user['name'], $user['pet_name'], $amount);
        }
        
        file_put_contents("callback_success.log", "[" . date('Y-m-d H:i:s') . "] Success: request_id=$request_id, mpesa=$mpesaReceipt, amount=$amount\n", FILE_APPEND);
        
        echo json_encode(["success" => true, "message" => "Payment confirmed & email sent"]);
    } else {
        file_put_contents("callback_error.log", "[" . date('Y-m-d H:i:s') . "] Invalid data: request_id=$request_id, receipt=$mpesaReceipt, ref=$accountRef\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Invalid payment data"]);
    }
} else {
    // Failure handling
    $accountRef = $callbackData['Body']['stkCallback']['AccountReference'] ?? '';
    preg_match('/Adoption_(\d+)/', $accountRef, $matches);
    $request_id = $matches[1] ?? null;
    
    if ($request_id) {
        $conn->prepare("UPDATE payments SET status='failed' WHERE checkout_request_id=?")
             ->execute([$accountRef]);
        file_put_contents("callback_failed.log", "[" . date('Y-m-d H:i:s') . "] Failed: request_id=$request_id, code=$resultCode\n", FILE_APPEND);
    }
    
    echo json_encode([
        "success" => false, 
        "message" => $callbackData['Body']['stkCallback']['CustomerMessage'] ?? 'Payment failed',
        "result_code" => $resultCode
    ]);
}

// Always return 200 OK to Safaricom
http_response_code(200);
?>

