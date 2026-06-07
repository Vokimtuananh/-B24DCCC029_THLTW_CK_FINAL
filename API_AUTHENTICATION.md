# Authentication API Documentation

## Endpoints

### 1. Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "tuananh",
  "email": "tuananh@example.com",
  "password": "StrongPassword123",
  "fullName": "Tuần Anh",
  "role": "viewer" // optional: admin, staff, manager, viewer (default: viewer)
}
```

**Response (Success 201):**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "672a1b2c3d4e5f6g7h8i9j0k",
    "username": "tuananh",
    "email": "tuananh@example.com",
    "fullName": "Tuần Anh",
    "role": "viewer"
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "tuananh@example.com",
  "password": "StrongPassword123"
}
```

**Response (Success 200):**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "672a1b2c3d4e5f6g7h8i9j0k",
    "username": "tuananh",
    "email": "tuananh@example.com",
    "fullName": "Tuần Anh",
    "role": "viewer"
  }
}
```

---

### 3. Get Current User Info
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success 200):**
```json
{
  "_id": "672a1b2c3d4e5f6g7h8i9j0k",
  "username": "tuananh",
  "email": "tuananh@example.com",
  "fullName": "Tuần Anh",
  "role": "viewer",
  "isActive": true,
  "lastLogin": "2026-06-07T10:30:00Z",
  "createdAt": "2026-06-07T08:00:00Z",
  "updatedAt": "2026-06-07T10:30:00Z"
}
```

---

### 4. Get All Users (Admin Only)
**GET** `/api/users`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (Success 200):**
```json
[
  {
    "_id": "672a1b2c3d4e5f6g7h8i9j0k",
    "username": "tuananh",
    "email": "tuananh@example.com",
    "fullName": "Tuần Anh",
    "role": "viewer",
    "isActive": true,
    "createdAt": "2026-06-07T08:00:00Z"
  }
]
```

---

### 5. Create User (Admin Only)
**POST** `/api/users`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123",
  "fullName": "New User",
  "role": "staff" // admin, staff, manager, viewer
}
```

**Response (Success 201):**
```json
{
  "id": "672a1b2c3d4e5f6g7h8i9j0k",
  "username": "newuser",
  "email": "newuser@example.com",
  "fullName": "New User",
  "role": "staff"
}
```

---

### 6. Update User (Admin Only)
**PUT** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "role": "manager",
  "isActive": true,
  "schoolId": ["672a1b2c3d4e5f6g7h8i9j0k"]
}
```

**Response (Success 200):**
```json
{
  "_id": "672a1b2c3d4e5f6g7h8i9j0k",
  "username": "newuser",
  "email": "newuser@example.com",
  "fullName": "Updated Name",
  "role": "manager",
  "isActive": true
}
```

---

### 7. Delete User (Admin Only)
**DELETE** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (Success 200):**
```json
{
  "message": "Xóa người dùng thành công"
}
```

---

## Protected Endpoints (Require Authentication)

### Write Operations (Create, Update, Delete) Now Require:
- **POST** `/api/schools` - Admin, Manager
- **PUT** `/api/schools/:id` - Admin, Manager
- **DELETE** `/api/schools/:id` - Admin, Manager
- **POST** `/api/majors` - Admin, Manager
- **POST** `/api/admission-blocks` - Admin, Manager
- **POST** `/api/quotas` - Admin, Manager
- **PUT** `/api/applications/:id/scores` - Admin, Staff, Manager
- **PUT** `/api/applications/:id/status` - Admin, Manager

### Read Operations (GET):
- ✅ No authentication required (public)

---

## User Roles & Permissions

| Role | Schools | Majors | Blocks | Applications | Users |
|------|---------|--------|--------|--------------|-------|
| **admin** | Full Access | Full Access | Full Access | Full Access | Full Access |
| **manager** | Create/Edit/Delete | Create/Edit/Delete | Create/Edit/Delete | Edit Scores & Status | Read Only |
| **staff** | Read Only | Read Only | Read Only | Edit Scores | Read Only |
| **viewer** | Read Only | Read Only | Read Only | Read Only | No Access |

---

## How to Use the Token

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example using curl:**
```bash
curl -X GET http://localhost:5000/api/schools \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Example using JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/schools', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Error Responses

### 400 Bad Request
```json
{ "error": "Vui lòng cung cấp tất cả thông tin bắt buộc" }
```

### 401 Unauthorized
```json
{ "error": "Email hoặc mật khẩu không chính xác" }
```

### 403 Forbidden
```json
{ "error": "Không có quyền truy cập" }
```

### 404 Not Found
```json
{ "error": "Người dùng không tồn tại" }
```

### 500 Internal Server Error
```json
{ "error": "Lỗi khi đăng nhập" }
```

---

## Testing with Postman

1. **Register**: POST to `/api/auth/register`
2. **Login**: POST to `/api/auth/login` (get token)
3. **Use Token**: Add to Headers: `Authorization: Bearer <token>`
4. **Test Protected Routes**: GET `/api/auth/me`

---

## Token Expiration

Tokens expire based on `JWT_EXPIRATION` in `.env` (default: 7 days)

After expiration, user must login again to get a new token.

