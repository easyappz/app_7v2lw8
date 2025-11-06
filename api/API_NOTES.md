# API notes for Classifieds

Base URL: /api

Auth uses JWT in headers: Authorization: Bearer <access_token>

Main endpoints
- POST /api/auth/register — Register user (username, password, email optional)
- POST /api/auth/login — Obtain JWT pair (access, refresh)
- POST /api/auth/refresh — Refresh JWT
- GET /api/auth/me — Current user profile

Public listings
- GET /api/listings/ — List approved and active listings only
  - Filters (query params):
    - price_min, price_max (numbers)
    - category (id or slug)
    - query (search in title/description)
    - ordering: one of price, -price, created_at, -created_at, views_count, -views_count
  - Pagination: page, page_size (max 50)
- GET /api/listings/{id}/ — Detail. Unapproved/inactive hidden from public (404). Visible to author/admin.

My listings (auth required)
- GET /api/my/listings/
- POST /api/my/listings/ — Create listing (multipart). Fields:
  - title, description, price, category, location
  - images: multiple files
  - main_image_index: optional index among uploaded images to mark as main
  - images_is_main: optional list aligned with images (true/false), only one main allowed
- GET /api/my/listings/{id}/
- PATCH/PUT /api/my/listings/{id}/ — Update. If listing was APPROVED and user is not admin, status resets to PENDING and rejected_reason cleared.
  - Additional optional fields on update:
    - remove_image_ids: list/CSV/JSON of image IDs to delete
    - set_main_image_id: existing image ID to mark as main
- DELETE /api/my/listings/{id}/

Admin
- GET/POST/PATCH/DELETE /api/admin/listings/… — Full CRUD with filters (price_min, price_max, status, is_active, author, category, query)
- POST /api/admin/listings/{id}/approve/ — Approve
- POST /api/admin/listings/{id}/reject/ — Reject (body: {"reason": "..."})
- PATCH /api/admin/listings/{id}/toggle-active/ — Toggle active flag
- GET /api/admin/users/ — List users (filter: is_active=true/false)
- PATCH /api/admin/users/{id}/toggle-active/ — Toggle is_active; inactive users cannot login

cURL examples
- Register
  curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"username":"john","password":"pass1234","email":"john@example.com"}'

- Login
  curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"username":"john","password":"pass1234"}'

- Me
  curl http://localhost:8000/api/auth/me -H "Authorization: Bearer <ACCESS>"

- Create listing with images
  curl -X POST http://localhost:8000/api/my/listings/ \
    -H "Authorization: Bearer <ACCESS>" \
    -F "title=Phone" -F "description=Good" -F "price=100" -F "category=1" \
    -F "images=@/path/a.jpg" -F "images=@/path/b.jpg" -F "main_image_index=1"

- Filter listings
  curl 'http://localhost:8000/api/listings/?category=1&price_min=100&price_max=1000&query=phone&ordering=-price'

- Approve listing (admin)
  curl -X POST http://localhost:8000/api/admin/listings/42/approve/ -H "Authorization: Bearer <ACCESS>"

- Reject listing (admin)
  curl -X POST http://localhost:8000/api/admin/listings/42/reject/ -H "Authorization: Bearer <ACCESS>" -H "Content-Type: application/json" -d '{"reason":"spam"}'

- Toggle user active (admin)
  curl -X PATCH http://localhost:8000/api/admin/users/7/toggle-active/ -H "Authorization: Bearer <ACCESS>"
