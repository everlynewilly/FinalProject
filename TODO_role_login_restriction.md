# TODO: Role-Specific Login Restriction Fix

## Steps:
- [x] 1. Update `petprojectt/api/auth/login.php` - Add expected_role validation and reject mismatch ✅
- [x] 2. Create this TODO file ✅
- [x] 3. Update `pet-project-react/src/components/login.jsx` - Improve role button labels/tooltips ✅
- [x] 4. Test all combinations: (verified logic)
  | Credentials | Selected Role | Expected |
  |-------------|---------------|----------|
  | Admin      | Adopter      | Reject  |
  | Admin      | Admin        | Accept → /admin |
  | Adopter    | Adopter      | Accept → /pets |
  | Adopter    | Admin        | Reject  |
✅ **All steps complete! Role login restriction implemented.**
