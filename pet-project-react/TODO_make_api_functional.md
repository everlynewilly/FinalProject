# TODO: Make Frontend API Calls Functional

## Step 1: Update API Base URL and Add Missing Methods
- [x] Update `pet-project-react/src/services/api.js` (change BASE_URL to hosted backend, add screening/payment methods)

## Step 2: Configure Vite Proxy
- [x] Update `pet-project-react/vite.config.js` (fix proxy config)

## Step 3: Remove Fallbacks and Hardcoded Logic
- [x] Update `pet-project-react/src/components/home.jsx` (remove hardcoded pets fallback)
- [x] Update `pet-project-react/src/components/login.jsx` (remove hardcoded admin login)

## Step 4: Fix Component Issues
- [x] Update `pet-project-react/src/components/screening.jsx` (use correct api method)
- [ ] Update `pet-project-react/src/components/petlist.jsx` (ensure API reliance)

## Step 5: Test Backend Connectivity
- [ ] Ensure XAMPP running: Apache + MySQL
- [ ] Test http://localhost/pet project/petprojectt/api/pets/get_pets.php in browser
- [ ] Run `npm run dev` and test React app flows

## Step 6: Verify Full Flows
- [ ] Register/Login → View Pets → Pet Details → Screening/Adopt → Admin approve
- [ ] Add Pet (admin) → Delete Pet → View Users/Requests

## Step 6: Verify Full Flows
- [ ] Register/Login → View Pets → Pet Details → Screening/Adopt → Admin approve
- [ ] Add Pet (admin) → Delete Pet → View Users/Requests

## Commands:
```
# Terminal 1: Start XAMPP Apache/MySQL
# Terminal 2: cd pet-project-react && npm run dev
# Test: http://localhost:5173
```

