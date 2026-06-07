# File Upload API Documentation

## Overview

Complete file upload system using MongoDB GridFS. Supports images, documents, and data files with automatic storage, retrieval, and deletion.

---

## Features

✅ **MongoDB GridFS Storage** - Files stored directly in MongoDB
✅ **File Type Validation** - MIME type + extension verification
✅ **File Size Limits** - 5MB maximum per file
✅ **Public & Private Files** - Avatars & logos are public
✅ **Access Control** - Role-based permissions
✅ **Multiple File Categories** - Avatar, Document, Logo, Data
✅ **Metadata Tracking** - Automatic file metadata recording
✅ **Download with Correct MIME Type** - Proper content-type headers

---

## Supported File Types

### Images (Avatar, Logo)
- **Formats:** JPG, PNG, SVG
- **Max Size:** 5MB
- **Public Access:** Yes

### Documents
- **Formats:** PDF, DOC, DOCX
- **Max Size:** 5MB
- **Public Access:** No (owner/admin only)

### Data Files
- **Formats:** CSV, XLS, XLSX
- **Max Size:** 5MB
- **Public Access:** No (admin/manager only)

---

## API Endpoints

### 1. Upload Application Document
**POST** `/api/files/applications/:applicationId/upload`

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request:**
```
Form Data:
- file: <binary file>

Example curl:
curl -X POST http://localhost:5000/api/files/applications/67abc.../upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@resume.pdf"
```

**Response (201):**
```json
{
  "message": "File upload thành công",
  "file": {
    "id": "67def...",
    "originalName": "resume.pdf",
    "size": 245678,
    "uploadDate": "2026-06-07T10:30:00Z",
    "url": "/api/files/67def.../download"
  }
}
```

**Errors:**
- `400` - No file provided
- `400` - File type not allowed
- `400` - File size exceeds limit
- `401` - Missing or invalid token
- `500` - Server error

---

### 2. Upload User Avatar
**POST** `/api/files/users/:userId/avatar`

**Authentication:** Required (own user or admin)

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/users/67abc.../avatar \
  -H "Authorization: Bearer <token>" \
  -F "file=@profile.jpg"
```

**Response (201):**
```json
{
  "message": "Upload avatar thành công",
  "file": {
    "id": "67def...",
    "url": "/api/files/users/67abc.../avatar"
  }
}
```

---

### 3. Upload School Logo
**POST** `/api/files/schools/:schoolId/logo`

**Authentication:** Required (admin/manager only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/schools/67abc.../logo \
  -H "Authorization: Bearer <admin-token>" \
  -F "file=@logo.png"
```

**Response (201):**
```json
{
  "message": "Upload logo thành công",
  "file": {
    "id": "67def...",
    "url": "/api/files/schools/67abc.../logo"
  }
}
```

---

### 4. Upload Data File (CSV/Excel)
**POST** `/api/files/import/applications`

**Authentication:** Required (admin/manager only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/import/applications \
  -H "Authorization: Bearer <admin-token>" \
  -F "file=@applications.csv"
```

**Response (201):**
```json
{
  "message": "Upload file dữ liệu thành công",
  "file": {
    "id": "67def...",
    "originalName": "applications.csv",
    "size": 51234,
    "url": "/api/files/67def.../download"
  }
}
```

---

### 5. Download File by ID
**GET** `/api/files/:fileId/download`

**Authentication:** Required (owner/admin for private files)

**Request:**
```bash
curl -X GET http://localhost:5000/api/files/67def.../download \
  -H "Authorization: Bearer <token>" \
  -o downloaded_file.pdf
```

**Response:**
- Binary file content with correct `Content-Type` header
- Status: 200 OK

**Example Response Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume.pdf"
Content-Length: 245678
```

---

### 6. Get User Avatar
**GET** `/api/files/users/:userId/avatar`

**Authentication:** Not required (public endpoint)

**Request:**
```bash
curl -X GET http://localhost:5000/api/files/users/67abc.../avatar
```

**Response:**
- Binary image content
- Status: 200 OK
- Cache-Control: public, max-age=86400 (1 day)

**HTML Usage:**
```html
<img src="/api/files/users/67abc.../avatar" alt="User Avatar">
```

---

### 7. Get School Logo
**GET** `/api/files/schools/:schoolId/logo`

**Authentication:** Not required (public endpoint)

**Request:**
```bash
curl -X GET http://localhost:5000/api/files/schools/67abc.../logo
```

**Response:**
- Binary image content
- Status: 200 OK
- Cache-Control: public, max-age=604800 (1 week)

---

### 8. List Files for Application
**GET** `/api/applications/:applicationId/files`

**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:5000/api/applications/67abc.../files \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "67def...",
      "originalName": "resume.pdf",
      "size": 245678,
      "category": "document",
      "uploadDate": "2026-06-07T10:30:00Z",
      "uploadedBy": "67ghi...",
      "url": "/api/files/67def.../download"
    },
    {
      "id": "67jkl...",
      "originalName": "transcript.pdf",
      "size": 189234,
      "category": "document",
      "uploadDate": "2026-06-07T10:45:00Z",
      "uploadedBy": "67ghi...",
      "url": "/api/files/67jkl.../download"
    }
  ],
  "total": 2
}
```

---

### 9. Delete File
**DELETE** `/api/files/:fileId`

**Authentication:** Required (owner/admin)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/files/67def.../delete \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "message": "Xóa file thành công"
}
```

---

### 10. Delete Application Document
**DELETE** `/api/applications/:applicationId/files/:fileId`

**Authentication:** Required (owner/staff/admin)

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/applications/67abc.../files/67def.../delete \
  -H "Authorization: Bearer <token>"
```

**Response (200):**
```json
{
  "message": "Xóa file thành công"
}
```

---

## File Metadata Model

Each uploaded file has associated metadata:

```json
{
  "_id": "ObjectId",
  "gridFsId": "GridFS file ID",
  "originalName": "Original filename",
  "filename": "Sanitized filename",
  "mimeType": "application/pdf",
  "size": 245678,
  "category": "document",
  "uploadedBy": "User ID",
  "uploadedFor": {
    "type": "application",
    "id": "Application ID"
  },
  "uploadDate": "2026-06-07T10:30:00Z",
  "expiryDate": null,
  "isPublic": false,
  "metadata": {
    "applicationId": "67abc..."
  },
  "createdAt": "2026-06-07T10:30:00Z",
  "updatedAt": "2026-06-07T10:30:00Z"
}
```

---

## Frontend Example (React)

### Upload File
```typescript
const uploadFile = async (applicationId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `/api/files/applications/${applicationId}/upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log('File uploaded:', data.file);
  }
};
```

### Download File
```typescript
const downloadFile = async (fileId: string) => {
  const response = await fetch(`/api/files/${fileId}/download`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file'; // Set appropriate filename
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
```

### Display Avatar
```typescript
const UserAvatar = ({ userId }: { userId: string }) => {
  return (
    <img 
      src={`/api/files/users/${userId}/avatar`} 
      alt="User Avatar"
      width={100}
      height={100}
    />
  );
};
```

### Upload Avatar
```typescript
const uploadAvatar = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `/api/files/users/${userId}/avatar`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    }
  );

  if (response.ok) {
    // Refresh avatar or update state
    window.location.reload();
  }
};
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Kích thước file vượt quá giới hạn 5MB"
}
```

**401 Unauthorized:**
```json
{
  "error": "Token không được cung cấp"
}
```

**403 Forbidden:**
```json
{
  "error": "Không có quyền download file này"
}
```

**404 Not Found:**
```json
{
  "error": "File không tồn tại"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Lỗi khi upload file"
}
```

---

## Storage Location

All files are stored in MongoDB Atlas using GridFS:

```
Database: admission_system
Collections:
  - fs.files          (file metadata)
  - fs.chunks         (file chunks)
  - fileMetadata      (custom metadata)
```

---

## Performance & Caching

### Avatar Caching
- Cache-Control: public, max-age=86400
- 1-day browser cache

### Logo Caching
- Cache-Control: public, max-age=604800
- 1-week browser cache

### File Size Limits
- Single file: 5MB maximum
- Total per upload: 5MB
- GridFS supports up to 16MB per chunk

---

## Security Considerations

✅ **File Type Validation**
- MIME type check
- Extension validation
- Double verification

✅ **File Size Limits**
- 5MB per file
- Multer enforces limit

✅ **Access Control**
- Authentication required for sensitive operations
- Role-based permissions
- Public files: avatars, logos only

✅ **Filename Sanitization**
- Special characters removed
- Unique filenames generated
- Prevents directory traversal

✅ **MongoDB GridFS**
- No direct file system access
- Automatic chunk management
- Secure binary storage

---

## Testing Checklist

- [ ] Upload image (JPG, PNG)
- [ ] Upload document (PDF)
- [ ] Upload CSV file
- [ ] Download uploaded file
- [ ] List application files
- [ ] Get user avatar (public)
- [ ] Get school logo (public)
- [ ] Delete file (owner)
- [ ] Delete file (admin)
- [ ] Verify file size limit
- [ ] Verify file type validation
- [ ] Verify auth on endpoints
- [ ] Verify GridFS storage in MongoDB

