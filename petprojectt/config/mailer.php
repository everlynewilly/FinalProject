<?php

/**
 * Email Sending Functions using SMTP
 * Configured for Gmail SMTP
 */

define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'vmutheu865@gmail.com');
define('SMTP_PASSWORD', 'aecoyuhwbsnlcbxf');
define('SMTP_FROM_EMAIL', 'vmutheu865@gmail.com');
define('SMTP_FROM_NAME', 'Pet Adoption System');
define('SMTP_SECURE', 'tls');

/**
 * Send email using SMTP
 */
function sendEmailSMTP($toEmail, $toName, $subject, $htmlMessage)
{
    $socket = fsockopen(
        (SMTP_SECURE === 'ssl' ? 'ssl://' : '') . SMTP_HOST,
        SMTP_PORT,
        $errno,
        $errstr,
        30
    );
    
    if (!$socket) {
        error_log("SMTP Connection failed: $errstr ($errno)");
        return false;
    }
    
    $response = fgets($socket, 515);
    fputs($socket, "HELO localhost\r\n");
    $response = fgets($socket, 515);
    
    if (SMTP_SECURE === 'tls') {
        fputs($socket, "STARTTLS\r\n");
        $response = fgets($socket, 515);
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        fputs($socket, "HELO localhost\r\n");
        $response = fgets($socket, 515);
    }
    
    fputs($socket, "AUTH LOGIN\r\n");
    $response = fgets($socket, 515);
    
    fputs($socket, base64_encode(SMTP_USERNAME) . "\r\n");
    $response = fgets($socket, 515);
    
    fputs($socket, base64_encode(SMTP_PASSWORD) . "\r\n");
    $response = fgets($socket, 515);
    
    if (substr($response, 0, 3) !== '235') {
        error_log("SMTP Auth failed: $response");
        fclose($socket);
        return false;
    }
    
    fputs($socket, "MAIL FROM: <" . SMTP_FROM_EMAIL . ">\r\n");
    $response = fgets($socket, 515);
    
    fputs($socket, "RCPT TO: <$toEmail>\r\n");
    $response = fgets($socket, 515);
    
    fputs($socket, "DATA\r\n");
    $response = fgets($socket, 515);
    
    $headers = "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . SMTP_FROM_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "To: $toName <$toEmail>\r\n";
    $headers .= "Subject: $subject\r\n";
    
    fputs($socket, $headers . "\r\n" . $htmlMessage . "\r\n");
    fputs($socket, ".\r\n");
    $response = fgets($socket, 515);
    
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    if (substr($response, 0, 3) === '250') {
        return true;
    }
    
    error_log("SMTP send failed: $response");
    return false;
}

/**
 * Send Approval Email with Payment Link
 */
function sendApprovalEmail($toEmail, $toName, $petName, $requestId, $fee = 0)
{
    $paymentLink = "http://localhost:5173/payment?request_id=" . $requestId;
     
    $subject = "Your Adoption Request Approved - Pay KSh " . number_format($fee, 0) . " Now!";
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #28a745; }
            .header h1 { color: #28a745; margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .highlight-box { background-color: #e8f5e9; border: 2px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
            .pet-name { font-size: 24px; font-weight: bold; color: #28a745; }
            .fee { font-size: 20px; font-weight: bold; color: #dc3545; }
            .button { display: inline-block; background-color: #28a745; color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .button:hover { background-color: #218838; }
            .link-section { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .link-text { word-break: break-all; color: #666; font-size: 14px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; border-top: 1px solid #eee; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✅ APPROVED!</h1>
            </div>
            <div class='content'>
                <p class='greeting'>Hello <strong>$toName</strong>,</p>
                
                <div class='highlight-box'>
                    <p style='margin: 0; font-size: 16px;'>Your adoption request for</p>
                    <p class='pet-name'>$petName</p>
                    <p style='margin: 0; font-size: 16px;'>has been <strong>APPROVED</strong>!</p>
                </div>
                
                <p><strong>Final step:</strong> Pay the adoption fee to complete.</p>
                <p class='fee'>Total: KSh " . number_format($fee, 0) . "</p>
                
                <div style='text-align: center;'>
                    <a href='$paymentLink' class='button'>💳 PAY NOW</a>
                </div>
                
                <div class='link-section'>
                    <p style='margin: 0 0 10px 0; font-size: 14px; color: #666;'>Direct link:</p>
                    <p class='link-text'>$paymentLink</p>
                </div>
                
                <p>Payment confirmation will be sent immediately after successful M-Pesa transaction.</p>
                
                <p>Thank you for giving $petName a loving home! 🐾</p>
                
                <p>Best regards,<br><strong>Pet Adoption Team</strong></p>
            </div>
            <div class='footer'>
                <p>This is an automated message. Reply to ruthmueni309@gmail.com for support.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return sendEmailSMTP($toEmail, $toName, $subject, $message);
}

/**
 * Send Payment Confirmation Email
 */
function sendPaymentConfirmationEmail($toEmail, $toName, $petName, $amount)
{
    $subject = "Payment Confirmed - $petName Adoption";
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body>
        <h2>Payment Received!</h2>
        <p>Dear <strong>$toName</strong>,</p>
        <p>We have received your payment of <strong>KSh $amount</strong> for adopting <strong>$petName</strong>.</p>
        <p>Thank you for your adoption!</p>
        <p>Our team will contact you soon with pickup details.</p>
        <p>Best regards,<br>Pet Adoption Team</p>
    </body>
    </html>
    ";
    
    return sendEmailSMTP($toEmail, $toName, $subject, $message);
}

/**
 * Send Rejection Email
 */
function sendRejectionEmail($toEmail, $toName, $petName)
{
    $subject = "Update on Your Adoption Request for $petName";
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body>
        <h2>Adoption Request Update</h2>
        <p>Dear <strong>$toName</strong>,</p>
        <p>Thank you for your interest in adopting <strong>$petName</strong>.</p>
        <p>After careful consideration, we regret to inform you that your adoption request was not approved at this time.</p>
        <p>We encourage you to apply for other pets in the future.</p>
        <p>Best regards,<br>Pet Adoption Team</p>
    </body>
    </html>
    ";
    
    return sendEmailSMTP($toEmail, $toName, $subject, $message);
}

function sendEmail($toEmail, $toName, $subject, $htmlMessage, $plainMessage = '')
{
    return sendEmailSMTP($toEmail, $toName, $subject, $htmlMessage);
}

