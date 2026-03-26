<?php
/**
 * Simple PHPMailer-like class for sending emails via SMTP
 */

namespace PHPMailer\PHPMailer;

class PHPMailer {
    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';
    
    public $Host;
    public $Port = 587;
    public $SMTPAuth = false;
    public $Username;
    public $Password;
    public $SMTPSecure = 'tls';
    public $isSMTP = false;
    public $isHTML = false;
    
    public $fromEmail;
    public $fromName;
    public $to = [];
    public $subject;
    public $body;
    public $altBody;
    
    public function __construct($exceptions = true) {
        // Constructor
    }
    
    public function isSMTP() {
        $this->isSMTP = true;
    }
    
    public function isHTML($isHtml = true) {
        $this->isHTML = $isHtml;
    }
    
    public function setFrom($email, $name = '') {
        $this->fromEmail = $email;
        $this->fromName = $name;
    }
    
    public function addAddress($email, $name = '') {
        $this->to[] = ['email' => $email, 'name' => $name];
    }
    
    public function Subject($subject) {
        $this->subject = $subject;
    }
    
    public function Body($body) {
        $this->body = $body;
    }
    
    public function AltBody($altBody) {
        $this->altBody = $altBody;
    }
    
    public function send() {
        // Use PHP mail() function as fallback
        $toEmail = $this->to[0]['email'] ?? '';
        $toName = $this->to[0]['name'] ?? '';
        
        if (empty($toEmail)) {
            throw new \Exception("No recipient email address");
        }
        
        $headers = "From: {$this->fromName} <{$this->fromEmail}>\r\n";
        $headers .= "Reply-To: {$this->fromEmail}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        
        if ($this->isHTML) {
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $message = $this->body;
        } else {
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $message = $this->altBody;
        }
        
        $subject = $this->subject;
        
        // Use @ to suppress warnings and return true/false
        $result = @mail($toEmail, $subject, $message, $headers);
        
        if (!$result) {
            throw new \Exception("Failed to send email");
        }
        
        return true;
    }
}

class Exception extends \Exception {
    // Exception class
}
