# TODO: Fix Screening Submission & Approval Email with Payment

## Information:
- Frontend screening.jsx calls wrong API (submitApplication instead of submitScreening)
- screening/submit.php stores correctly to both tables
- approve_screening.php: No email/payment trigger
- adoption_requests/approve.php: Has email with payment link via mailer.php
- mailer.php: SMTP Gmail with HTML "Pay Now" button linking payment?request_id
- payment.php: Creates mock payment record

## Plan:
1. Fix frontend screening.jsx: Call submitScreening()
2. screening/approve_screening.php: Add email + update adoption_status to 'approved'
3. Ensure payment flow: approve → email → payment page works
4. Test full flow

## Steps:
- [x] 1. Create TODO ✅
- [x] 2. Update pet-project-react/src/components/screening.jsx - Change to apiService.submitScreening ✅
- [x] 3. Update petprojectt/api/screening/approve_screening.php - Add email sending + status sync ✅
- [ ] 4. Test: Submit screening → Admin approve → Email with Pay Now → Payment works
- [ ] 5. Complete

**Progress:** Ready to implement.
