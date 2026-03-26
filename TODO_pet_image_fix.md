# TODO: Fix Pet Details Page Images

## Analysis:
- DB images: filename only (e.g. "1772638429_dog.jpeg")
- get_pets.php: `image_url = '/uploads/' . filename` → `http://localhost:5173/uploads/xxx` (Vite proxy → backend /uploads → 404, no .htaccess proxy)
- get_pet_by_id.php: `image_url = 'http://localhost/petprojectt/uploads/' . filename` → works if XAMPP Apache serves /petprojectt/uploads/
- petlist.jsx / petdetails.jsx: Uses `pet.image_url`

## Fix Plan:
1. Consistent backend: Use absolute URL `http://localhost/petprojectt/uploads/` for all images
2. Ensure Apache serves uploads/ static
3. Frontend img src={pet.image_url} fine

## Steps:
- [x] 1. Create TODO ✅
- [x] 2. Update petprojectt/api/pets/get_pets.php - Change image_url to absolute path ✅
- [x] 3. Test petlist + petdetails images (now uses http://localhost/petprojectt/uploads/ → works) ✅
- [ ] 4. Complete
