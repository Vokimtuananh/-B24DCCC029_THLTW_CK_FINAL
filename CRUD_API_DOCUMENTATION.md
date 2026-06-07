# Complete CRUD API Documentation

## Overview

All CRUD operations for Schools, Majors, AdmissionBlocks, Quotas, Applications, and Statistics are now available.

---

## 🏫 SCHOOLS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schools` | No | Get all active schools |
| GET | `/api/schools/:id` | No | Get single school |
| POST | `/api/schools` | Admin/Manager | Create school |
| PUT | `/api/schools/:id` | Admin/Manager | Update school |
| DELETE | `/api/schools/:id` | Admin/Manager | Soft delete school |

### Examples:

**Create School:**
```bash
POST /api/schools
Headers: Authorization: Bearer <token>
Body: {
  "code": "HUST",
  "name": "Đại học Bách Khoa Hà Nội",
  "description": "Trường hàng đầu",
  "address": "Hà Nội",
  "email": "admission@hust.edu.vn"
}

Response: { ... school object ... }
```

---

## 🎓 MAJORS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schools/:schoolId/majors` | No | Get majors by school (paginated) |
| GET | `/api/majors/:id` | No | Get single major |
| POST | `/api/majors` | Admin/Manager | Create major |
| PUT | `/api/majors/:id` | Admin/Manager | Update major |
| DELETE | `/api/majors/:id` | Admin/Manager | Soft delete major |

### Examples:

**Get Majors (with Pagination):**
```bash
GET /api/schools/67abc.../majors?page=1&limit=20

Response: {
  "data": [ ... majors ... ],
  "total": 10,
  "page": 1,
  "pages": 1
}
```

**Create Major:**
```bash
POST /api/majors
Headers: Authorization: Bearer <token>
Body: {
  "schoolId": "67abc...",
  "code": "7480201",
  "name": "Công Nghệ Thông Tin",
  "description": "Ngành IT",
  "tuitionPerSemester": 2000000,
  "duration": 4,
  "studyForm": "fulltime"
}

Response: { message: "Cập nhật ngành học thành công", data: { ... } }
```

**Update Major:**
```bash
PUT /api/majors/:id
Headers: Authorization: Bearer <token>
Body: {
  "name": "Công Nghệ Thông Tin (Cập nhật)",
  "tuitionPerSemester": 2500000
}

Response: { message: "Cập nhật ngành học thành công", data: { ... } }
```

**Delete Major (Soft Delete):**
```bash
DELETE /api/majors/:id
Headers: Authorization: Bearer <token>

Response: { message: "Xóa ngành học thành công" }
```

---

## 📋 ADMISSION BLOCKS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/majors/:majorId/blocks` | No | Get blocks by major (paginated) |
| GET | `/api/admission-blocks/:id` | No | Get single block |
| POST | `/api/admission-blocks` | Admin/Manager | Create block |
| PUT | `/api/admission-blocks/:id` | Admin/Manager | Update block |
| DELETE | `/api/admission-blocks/:id` | Admin/Manager | Soft delete block |

### Examples:

**Create Admission Block:**
```bash
POST /api/admission-blocks
Headers: Authorization: Bearer <token>
Body: {
  "majorId": "67abc...",
  "code": "A00",
  "name": "Khối Toán - Vật Lý - Hóa",
  "subjects": ["Toán", "Vật Lý", "Hóa Học"],
  "year": 2026
}

Response: { message: "Cập nhật khối tuyển sinh thành công", data: { ... } }
```

**Get Blocks (with Pagination):**
```bash
GET /api/majors/67abc.../blocks?page=1&limit=20

Response: {
  "data": [ ... blocks ... ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

---

## 📊 QUOTAS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quotas` | No | Get all quotas (paginated, filterable) |
| GET | `/api/quotas/:id` | No | Get single quota |
| POST | `/api/quotas` | Admin/Manager | Create quota |
| PUT | `/api/quotas/:id` | Admin/Manager | Update quota |
| DELETE | `/api/quotas/:id` | Admin/Manager | Delete quota (hard delete) |

### Filters for GET /api/quotas:
- `schoolId` - Filter by school
- `majorId` - Filter by major
- `admissionBlockId` - Filter by admission block
- `year` - Filter by year
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

### Examples:

**Get All Quotas:**
```bash
GET /api/quotas?page=1&limit=20&year=2026

Response: {
  "data": [ ... quotas ... ],
  "total": 50,
  "page": 1,
  "pages": 3
}
```

**Create Quota:**
```bash
POST /api/quotas
Headers: Authorization: Bearer <token>
Body: {
  "admissionBlockId": "67abc...",
  "majorId": "67def...",
  "quota": 100,
  "year": 2026
}

Response: { ... quota object ... }
```

**Update Quota:**
```bash
PUT /api/quotas/:id
Headers: Authorization: Bearer <token>
Body: {
  "quota": 120,
  "enrolled": 50,
  "available": 70
}

Response: { message: "Cập nhật chỉ tiêu thành công", data: { ... } }
```

**Delete Quota:**
```bash
DELETE /api/quotas/:id
Headers: Authorization: Bearer <token>

Response: { message: "Xóa chỉ tiêu thành công" }
```

---

## 📝 APPLICATIONS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/applications` | No | Get all applications (paginated, filterable) |
| GET | `/api/applications/:id` | No | Get single application |
| POST | `/api/applications` | No | Create application |
| PUT | `/api/applications/:id/scores` | Admin/Staff/Manager | Update scores |
| PUT | `/api/applications/:id/status` | Admin/Manager | Update status |
| DELETE | `/api/applications/:id` | Admin/Manager | Soft delete application |

### Filters for GET /api/applications:
- `status` - Application status (pending, accepted, rejected, waitlisted)
- `schoolId` - Filter by school
- `majorId` - Filter by major
- `year` - Filter by year
- `page` - Page number
- `limit` - Items per page

### Examples:

**Get Applications:**
```bash
GET /api/applications?status=pending&schoolId=67abc...&page=1&limit=20

Response: {
  "data": [ ... applications ... ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

**Delete Application (Soft Delete):**
```bash
DELETE /api/applications/:id
Headers: Authorization: Bearer <token>

Response: { message: "Xóa hồ sơ thành công" }
```

---

## 📈 STATISTICS - Complete CRUD

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/statistics` | No | Get all statistics (paginated, filterable) |
| GET | `/api/statistics/:id` | No | Get single statistic |
| GET | `/api/statistics/dashboard` | No | Get dashboard overview |
| GET | `/api/statistics/school/:schoolId` | No | Get stats by school |
| GET | `/api/statistics/major/:majorId` | No | Get stats by major |
| POST | `/api/statistics/generate` | Admin | Generate new statistics |

### Filters:
- `type` - Statistics type (daily, monthly, yearly)
- `schoolId` - Filter by school
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)
- `page` - Page number
- `limit` - Items per page

### Examples:

**Get All Statistics:**
```bash
GET /api/statistics?type=daily&page=1&limit=20

Response: {
  "data": [ ... statistics ... ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

**Get Statistics by School:**
```bash
GET /api/statistics/school/67abc...?type=monthly&dateFrom=2026-01-01&dateTo=2026-06-30

Response: {
  "data": [ ... statistics ... ],
  "total": 6,
  "page": 1,
  "pages": 1
}
```

**Get Statistics by Major:**
```bash
GET /api/statistics/major/67def...?type=daily

Response: {
  "data": [ ... statistics ... ],
  "total": 30,
  "page": 1,
  "pages": 2
}
```

**Generate Statistics (Admin Only):**
```bash
POST /api/statistics/generate
Headers: Authorization: Bearer <admin-token>
Body: {
  "type": "daily",
  "schoolId": "67abc..." // optional
}

Response: {
  "message": "Tạo thống kê thành công",
  "data": { ... statistics object ... }
}
```

**Get Dashboard (Quick Overview):**
```bash
GET /api/statistics/dashboard?schoolId=67abc...&year=2026

Response: {
  "statusCounts": {
    "pending": 50,
    "accepted": 150,
    "rejected": 100,
    "waitlisted": 25
  },
  "averageScore": 18.5,
  "majorStats": [
    {
      "majorId": "67def...",
      "majorName": "Công Nghệ Thông Tin",
      "applications": 200,
      "accepted": 100,
      "ratio": "50.00"
    }
  ]
}
```

---

## Response Format Standardization

### List Response (Paginated)
```json
{
  "data": [ ... items ... ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

### Create/Update Response
```json
{
  "message": "Action successful",
  "data": { ... object ... }
}
```

### Delete Response
```json
{
  "message": "Delete successful"
}
```

### Error Response
```json
{
  "error": "Description of error"
}
```

---

## Pagination Defaults

- **Default Limit:** 20 items per page
- **Max Limit:** 100 items per page
- **Default Page:** 1

Query string example:
```
?page=2&limit=50
```

---

## Authentication & Authorization

### Role-Based Access:

| Role | Create | Update | Delete |
|------|--------|--------|--------|
| **admin** | ✅ All | ✅ All | ✅ All |
| **manager** | ✅ Most | ✅ Most | ✅ Most |
| **staff** | ❌ No | ⚠️ Scores only | ❌ No |
| **viewer** | ❌ No | ❌ No | ❌ No |

### Protected Endpoints (Require Authentication):
- All POST endpoints (create)
- All PUT endpoints (update)
- All DELETE endpoints (delete)
- `/api/statistics/generate` (admin only)

---

## Soft Delete vs Hard Delete

### Soft Delete (Set isActive = false):
- Schools
- Majors
- AdmissionBlocks
- Applications

**Benefit:** Data preserved for history/auditing

### Hard Delete (Remove from database):
- Quotas

**Note:** Cannot be recovered after deletion

---

## Common Error Codes

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Invalid input | Check request body |
| 401 | Unauthorized | Add valid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not found | Check ID exists |
| 429 | Too many requests | Wait before retrying |
| 500 | Server error | Retry or contact support |

---

## Testing Checklist

### Majors
- [ ] GET all majors with pagination
- [ ] GET single major
- [ ] POST create major
- [ ] PUT update major
- [ ] DELETE soft delete major

### AdmissionBlocks
- [ ] GET all blocks with pagination
- [ ] GET single block
- [ ] POST create block
- [ ] PUT update block
- [ ] DELETE soft delete block

### Quotas
- [ ] GET all quotas with filters
- [ ] GET single quota
- [ ] POST create quota
- [ ] PUT update quota
- [ ] DELETE hard delete quota

### Applications
- [ ] DELETE soft delete application

### Statistics
- [ ] GET all statistics
- [ ] GET by school
- [ ] GET by major
- [ ] POST generate statistics

