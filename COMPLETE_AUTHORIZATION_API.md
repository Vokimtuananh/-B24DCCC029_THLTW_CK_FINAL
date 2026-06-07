# Complete Authorization API Documentation

## New Features Overview

✅ User Registration with Validation
✅ Login with Rate Limiting & Audit Logging
✅ Change Password
✅ Refresh Token
✅ Logout (Token Blacklist)
✅ Reset Password (2-step process)
✅ Input Validation
✅ Rate Limiting (Brute Force Protection)
✅ Audit Logging (All actions logged)

---

## 1. Register New User
**POST** `/api/auth/register`

**Rate Limited**: 3 registrations per hour per IP

**Request Body:**
```json
{
  "username": "tuananh",
  "email": "tuananh@example.com",
  "password": "SecurePass123!",
  "fullName": "Tuần Anh",
  "role": "viewer"
}
```

**Password Requirements:**
- At least 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&* etc.)

**Username Requirements:**
- 3-20 characters
- Only letters, numbers, _, -

**Response (201 Success):**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "67abc...",
    "username": "tuananh",
    "email": "tuananh@example.com",
    "fullName": "Tuần Anh",
    "role": "viewer"
  }
}
```

**Error Responses:**
```json
{ "error": "Tài khoản đã tồn tại" }
{ "errors": { "length": "Username phải có ít nhất 3 ký tự" } }
{ "errors": { "special": "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" } }
```

---

## 2. Login
**POST** `/api/auth/login`

**Rate Limited**: 5 attempts per 15 minutes per IP

**Request Body:**
```json
{
  "email": "tuananh@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 Success):**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67abc...",
    "username": "tuananh",
    "email": "tuananh@example.com",
    "fullName": "Tuần Anh",
    "role": "viewer"
  }
}
```

**Error Responses:**
```json
{ "error": "Email hoặc mật khẩu không chính xác" }
{ "error": "Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút" }
```

---

## 3. Get Current User Info
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "67abc...",
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

## 4. Change Password
**POST** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Response (200 Success):**
```json
{ "message": "Mật khẩu đã được thay đổi" }
```

**Error Responses:**
```json
{ "error": "Mật khẩu hiện tại không chính xác" }
{ "error": "Mật khẩu xác nhận không khớp" }
{ "errors": { "length": "Mật khẩu phải có ít nhất 8 ký tự" } }
```

---

## 5. Logout (Token Blacklist)
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 Success):**
```json
{ "message": "Đã đăng xuất thành công" }
```

**Details:**
- Token is added to blacklist immediately
- Expired tokens auto-purged every 10 minutes
- User cannot use token after logout

---

## 6. Refresh Token
**POST** `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 Success):**
```json
{
  "message": "Token đã được làm mới",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
{ "error": "Refresh token không hợp lệ" }
```

**Usage Flow:**
```
1. Login → get token
2. Token expires after 7 days
3. Use refresh-token endpoint to get new token
4. Continue using API without re-login
```

---

## 7. Reset Password - Step 1 (Request)
**POST** `/api/auth/reset-password-request`

**Request Body:**
```json
{
  "email": "tuananh@example.com"
}
```

**Response (200):**
```json
{
  "message": "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
  "_dev_resetCode": "123456"  // ONLY IN DEVELOPMENT - remove in production!
}
```

**Details:**
- Reset code valid for 30 minutes
- Same message whether email exists or not (security)
- In production: send code via email
- For development: code returned in response (REMOVE IN PRODUCTION!)

---

## 8. Reset Password - Step 2 (Confirm)
**POST** `/api/auth/reset-password-confirm`

**Request Body:**
```json
{
  "email": "tuananh@example.com",
  "resetCode": "123456",
  "newPassword": "NewSecurePass789!",
  "confirmPassword": "NewSecurePass789!"
}
```

**Response (200 Success):**
```json
{ "message": "Mật khẩu đã được đặt lại" }
```

**Error Responses:**
```json
{ "error": "Mã xác nhận không chính xác" }
{ "error": "Mã xác nhận đã hết hạn" }
{ "error": "Mật khẩu xác nhận không khớp" }
{ "errors": { "special": "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" } }
```

---

## Rate Limiting

### Login Rate Limit
- **Window**: 15 minutes
- **Max Requests**: 5 attempts
- **Purpose**: Prevent brute force attacks

### Register Rate Limit
- **Window**: 1 hour
- **Max Requests**: 3 registrations
- **Purpose**: Prevent spam registrations

### General API Rate Limit
- **Window**: 1 minute
- **Max Requests**: 100 requests
- **Purpose**: Prevent abuse

**Rate Limit Error (429):**
```json
{ "error": "Quá nhiều request, vui lòng thử lại sau" }
```

---

## Audit Logging

All authentication actions are logged:

| Action | Details |
|--------|---------|
| register | New user registration |
| login | User login attempts |
| logout | User logout |
| change_password | Password changes |
| reset_password_request | Password reset requests |
| reset_password_confirm | Password reset confirmations |

**Logged Information:**
- User ID
- Action type
- IP Address
- Status (success/failure)
- Error message (if failed)
- Timestamp

---

## Token Usage

### Generate Token (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Use Token (Protected Endpoints)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript Example
```javascript
// Login
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

const { token } = await loginRes.json();
localStorage.setItem('token', token);

// Use Token
const meRes = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const user = await meRes.json();
console.log(user);

// Change Password
const changeRes = await fetch('http://localhost:5000/api/auth/change-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    currentPassword: 'SecurePass123!',
    newPassword: 'NewSecurePass456!',
    confirmPassword: 'NewSecurePass456!'
  })
});

// Logout
await fetch('http://localhost:5000/api/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
localStorage.removeItem('token');
```

---

## Error Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful, data retrieved |
| 201 | Created | User registered |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Wrong password, invalid token |
| 403 | Forbidden | Token expired, no permission |
| 404 | Not Found | User doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database error, etc. |

---

## Security Best Practices

✅ **DO:**
- Store token in localStorage or sessionStorage
- Send token in Authorization header
- Use HTTPS in production
- Validate password strength
- Log all authentication actions
- Implement rate limiting
- Clear token on logout

❌ **DON'T:**
- Hardcode token in code
- Send credentials in URL
- Store unencrypted passwords
- Use weak passwords
- Disable rate limiting
- Ignore audit logs

---

## Production Checklist

- [ ] Remove `_dev_resetCode` from response
- [ ] Set up email service for password resets
- [ ] Enable HTTPS
- [ ] Change JWT_SECRET to strong value
- [ ] Set secure CORS_ORIGIN
- [ ] Review audit logs regularly
- [ ] Implement email verification
- [ ] Set up monitoring for rate limits
- [ ] Test all error scenarios
- [ ] Document any custom modifications

