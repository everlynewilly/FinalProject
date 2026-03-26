# Connect Site to Server - Implementation Plan & Progress Tracker

## Status: 🔄 In Progress (0/6 complete)

**Goal**: Ensure React frontend ↔ PHP backend full functionality (XAMPP, DB, API, images).

### 1. [ ] Verify/Start XAMPP Services
   - XAMPP Control Panel: Start Apache + MySQL
   - Test: http://localhost/phpmyadmin (login root/no pass)
   - Test backend: http://localhost/petprojectt/api/pets/get_pets.php → JSON {'success':true, 'data':[...pet objects with image_url]}

### 2. [✅] Setup Database (imported schema.sql)
   - phpMyAdmin → pet_adoption_system → Import petprojectt/database_schema.sql
   - Or: `c:/xampp/mysql/bin/mysql -u root -p pet_adoption_system < petprojectt/database_schema.sql`
   - Run `petprojectt/create_pets_table.php` if needed
   - Verify: SELECT * FROM pets; (expect sample: Buddy, Whiskers, etc.)

### 3. [✅] Fix Images/CORS Proxy
   - ✅ Added `/uploads` proxy to vite.config.js
   - Test images: http://localhost:5173 → petlist → console RAW PETS RESPONSE, img src load

### 4. [ ] Frontend Setup & Test
   - cd pet-project-react && npm install && npm run dev
   - http://localhost:5173 → Petlist loads pets from DB, filters/search work
   - Test flows: Login/Register, Pet details, Add pet (admin), Adoption request

### 5. [ ] Backend Full Test
   - Admin login → getUsers, approveScreening, payments
   - Check uploads/ images served

### 6. [ ] Final Polish & Completion
   - Error handling, loading states
   - Update all TODO.md files
   - ✅ Task complete!

**Next Action**: Complete step-by-step. Report issues/output after each.

**Commands**:
```
# DB import (if needed)
cd c:/xampp/htdocs/project/petprojectt && c:/xampp/mysql/bin/mysql -u root pet_adoption_system < database_schema.sql

# Frontend
cd pet-project-react && npm run dev
```

