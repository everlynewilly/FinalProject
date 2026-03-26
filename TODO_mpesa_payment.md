# M-Pesa STK Push Fix - Enter PIN Prompt After Email Pay Now Button

## Information Gathered:
- Email sends HTML with "Pay Now via M-Pesa" button → `http://localhost:5173/payment?request_id=ID`
- payment.jsx auto-triggers `apiService.submitPayment({request_id})` → `/payments/payment.php` 404 on Vite
- Backend `petprojectt/payments/payment.php` ready: STK push via Daraja sandbox, saves payment record
- Vite proxy `/api/*` works, but `/payments/` 404. mpesa.php sandbox keys ready (callback ngrok)
- Current flow: Approval → Email → Click → Auto STK → M-Pesa PIN prompt ✓ (but 404 blocks)

## Plan:
**Backend (no change needed):**
- payments/payment.php: Full STK push logic ✓

**Frontend Fix:**
1. api.js: Change `fetch('/payments/payment.php')` → `fetch('/petprojectt/payments/payment.php')`
2. Or Vite proxy `/payments` → `http://localhost/project/petprojectt/payments`
3. payment.jsx: Auto-submit on load → triggers STK → "Check M-Pesa"

## Dependent Files:
- pet-project-react/src/services/api.js (update URL)
- (Alt) pet-project-react/vite.config.js (add proxy)

## Followup:
1. Fix URL/proxy
2. Test: Approve screening → Email Pay button → M-Pesa PIN ✓
3. Update ngrok callback if live
4. Complete

**Status:** Fixed api.js `/payments/payment.php` → `/petprojectt/payments/payment.php` ✓. Test: Email Pay Now → payment.jsx auto-submit → M-Pesa PIN prompt.
