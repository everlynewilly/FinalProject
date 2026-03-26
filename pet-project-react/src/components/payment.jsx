import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "../services/api";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasPaid, setHasPaid] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [requestDetails, setRequestDetails] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [amountError, setAmountError] = useState("");

  // Get request_id from URL
  const requestId = searchParams.get("request_id");

  // Validate phone (2547xxxxxxxxx or 2541xxxxxxxxx, 12-13 digits)
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('254') || !/^(2547|2541)[0-9]{8}$/.test(cleanPhone)) {
      return "Phone must be valid Kenyan M-Pesa number (e.g., 254712345678)";
    }
    return "";
  };

  // Validate amount (>0)
  const validateAmount = (amt) => {
    const num = parseFloat(amt);
    if (isNaN(num) || num <= 0) {
      return "Amount must be greater than 0";
    }
    return ""; // Amount read-only, backend validates
  };

  // Fetch request details on mount (optional hints)
  useEffect(() => {
    const fetchDetails = async () => {
      if (requestId) {
        try {
          const res = await fetch(`/api/payment/get_payment_request.php?request_id=${requestId}`);
          const text = await res.text();
          const data = JSON.parse(text);
          if (data.success) {
            setRequestDetails(data.data);
            setPhoneNumber(data.data.email ? '' : ''); // Hint phone if available, but require input
            setAmount(data.data.adoption_fee ? data.data.adoption_fee.toString() : '');
          }
        } catch (err) {
          console.log("Could not fetch details:", err);
        }
      }
    };
    fetchDetails();
  }, [requestId]);

  useEffect(() => {
    if (!requestId) {
      setMessage("❌ No adoption request ID in URL.");
    } else if (requestDetails) {
      setMessage(`Enter your M-Pesa phone and amount for request #${requestId} (Pet: ${requestDetails.pet_name}, Expected: KSh ${requestDetails.adoption_fee}).`);
    } else {
      setMessage(`Ready to pay for request #${requestId}.`);
    }
  }, [requestId, requestDetails]);

  const handlePayNow = async () => {
    if (loading || hasPaid) return;

    // Validate inputs
    const phoneErr = validatePhone(phoneNumber);
    setPhoneError(phoneErr);
    const amtErr = validateAmount(amount);
    setAmountError(amtErr);

    if (phoneErr || amtErr) {
      setMessage("❌ Please fix input errors.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Call new API with phone/amount
      const response = await apiService.initiatePayment({ 
        request_id: requestId, 
        phoneNumber, 
        amount: parseFloat(amount) 
      });
      
      console.log("🎉 Payment response:", response);

      if (response.success) {
        setMessage(`✅ STK Push sent to ${phoneNumber}! Check M-Pesa PIN. Polling status... Ref: ${response.debug?.account_ref || requestId}`);
        setHasPaid(true);
        // Start polling
        pollPaymentStatus();
      } else {
        setMessage(`❌ ${response.message || "Payment initiation failed"}`);
        if (response.debug) {
          setMessage(prev => prev + ` Debug: ${JSON.stringify(response.debug)}`);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("❌ Failed to connect. Ensure XAMPP Apache/MySQL running.");
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status
  const pollPaymentStatus = () => {
    let polls = 0;
    const maxPolls = 60; // 5 min at 5s intervals

    const interval = setInterval(async () => {
      polls++;
      try {
        const res = await fetch(`/api/payment/get_payment.php?request_id=${requestId}`);
        const data = await res.json();
        
        if (data.success && data.data.status === 'success') {
          clearInterval(interval);
          setMessage('🎉 Payment confirmed! Redirecting...');
          setTimeout(() => {
            window.location.href = `/adoption-success?request_id=${requestId}`;
          }, 1500);
          return;
        } else if (data.success && data.data.status === 'failed') {
          clearInterval(interval);
          setMessage('❌ Payment failed. Check M-Pesa or try again.');
          return;
        }
      } catch (err) {
        console.log('Poll error:', err);
      }
      
      if (polls >= maxPolls) {
        clearInterval(interval);
        setMessage('⏰ Payment pending. Check M-Pesa or refresh page.');
      }
    }, 5000);
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-card">
          <div className="payment-header">
            <h1>Adoption Payment</h1>
            {requestId && <p>Request ID: <strong>{requestId}</strong></p>}
            {requestDetails && (
              <div>
                <p>Pet: {requestDetails.pet_name} | Adopter: {requestDetails.adopter_name}</p>
                <small>Expected amount: KSh {requestDetails.adoption_fee} (editable)</small>
              </div>
            )}
          </div>

          {/* Input Form */}
          {!loading && !hasPaid && requestId ? (
            <div className="payment-form">
              <div className="input-group">
                <label>M-Pesa Phone Number *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setPhoneError("");
                  }}
                  placeholder="254712345678"
                  className={phoneError ? "error" : ""}
                />
                {phoneError && <span className="error-text">{phoneError}</span>}
              </div>

              <div className="input-group">
                <label>Amount (KSh) *</label>
                <input
                  type="number"
                  value={requestDetails?.adoption_fee?.toString() || ''}
                  readOnly
                  className="amount-readonly"
                  style={{backgroundColor: '#f8f9fa', fontWeight: 'bold', color: 'green'}}
                  placeholder="Auto-filled from pet fee" />
                {requestDetails && (
                  <small style={{color: 'green', fontWeight: 'bold'}}>
                    Pet Fee: <strong>KSh {requestDetails.adoption_fee}</strong> ✓ (Auto-filled)
                  </small>
                )}
                {amountError && !requestDetails && <span className="error-text">{amountError}</span>}
              </div>

              <button 
                onClick={handlePayNow} 
                className="pay-button"
                disabled={loading || !phoneNumber || !amount}
              >
                <span>💳</span>
                Pay Now via M-Pesa
              </button>

              <div className="security-note">
                <span>🔒</span>
                Secure M-Pesa STK Push (Sandbox)
              </div>
            </div>
          ) : null}

          {loading && (
            <div className="payment-status processing">
              <div className="spinner"></div>
              <p>🔄 Processing STK Push</p>
              <span>Check {phoneNumber} for M-Pesa PIN...</span>
            </div>
          )}
          
          {message && (
            <div className={`payment-status ${hasPaid ? 'success' : 'failed'}`}>
{hasPaid ? (
                <span className="status-icon">✅</span>
              ) : (
                <span className="status-icon">⏳</span>
              )}
              <p>{message}</p>
              {hasPaid && <small>Polling for confirmation...</small>}
            </div>
          )}
          
          {requestId && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a 
                href={`/confirmation?request_id=${requestId}`} 
                className="btn btn-secondary"
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                ← Back to Confirmation
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;