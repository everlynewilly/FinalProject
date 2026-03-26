# M-Pesa Integration Guide

## Sandbox Config (mpesa.php)
- Consumer Key/Secret: Provided
- Shortcode: 174379
- Passkey: Provided
- Callback: https://abcd1234.ngrok-free.app/petprojectt/payments/payment_callback.php

## Flow
1. POST `/api/payment/initiate_payment.php` → Token → STK Push
2. User gets M-Pesa prompt → Enter PIN
3. Safaricom POSTs callback → Updates DB → Email

## Logs
- `payments/payment_debug.log`: STK requests
- `payments/callback_success.log`: Success
- `payments/stk_log.txt`: Raw responses

## Test
1. Approve adoption request (admin)
2. Run curl test command
3. Check phone for STK prompt
4. Complete payment on phone
5. Verify: payments.status='success', adoption_requests='paid', pet.status='adopted', email sent

## Production
- Update URLs to `api.daraja.safaricom.co.ke`
- Live credentials
- HTTPS cert
