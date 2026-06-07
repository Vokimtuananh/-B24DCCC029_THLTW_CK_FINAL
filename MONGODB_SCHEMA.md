# MongoDB Atlas Database Design
## Hệ Thống Quản Lý Tuyển Sinh

### 📋 Tổng Quan Kiến Trúc

```
Schools (Trường)
    ├── Majors (Ngành)
    │   ├── AdmissionBlocks (Khối Tuyển Dụng)
    │   │   └── Applications (Hồ Sơ)
    │   └── Quotas (Chỉ Tiêu)
    └── Users (Người Dùng - Admin)
```

---

## 🗄️ Các Collection

### 1. **schools** - Quản Lý Trường Đại Học

```javascript
{
  _id: ObjectId,
  code: String,              // VD: "HUST", "NUS", không được trùng
  name: String,              // VD: "Đại học Bách Khoa Hà Nội"
  description: String,       // Mô tả tóm tắt
  address: String,           // Địa chỉ
  phone: String,             // Số điện thoại liên hệ
  email: String,             // Email liên hệ
  website: String,           // Website trường
  logo: String,              // URL ảnh logo
  isActive: Boolean,         // Status: true = hoạt động
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.schools.createIndex({ code: 1 }, { unique: true })
db.schools.createIndex({ isActive: 1 })
```

---

### 2. **majors** - Quản Lý Ngành Học

```javascript
{
  _id: ObjectId,
  schoolId: ObjectId,        // Reference đến schools
  code: String,              // VD: "7480201" (mã ngành quốc tế)
  name: String,              // VD: "Công Nghệ Thông Tin"
  description: String,       // Mô tả ngành
  tuitionPerSemester: Number, // Học phí/học kỳ (VND)
  duration: Number,          // Thời gian học (năm)
  studyForm: String,         // "fulltime" | "parttime" | "distance"
  isActive: Boolean,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.majors.createIndex({ schoolId: 1 })
db.majors.createIndex({ code: 1 })
db.majors.createIndex({ isActive: 1 })
db.majors.createIndex({ schoolId: 1, isActive: 1 })
```

---

### 3. **admissionBlocks** - Khối Tuyển Dụng (Tổ Hợp Môn)

```javascript
{
  _id: ObjectId,
  majorId: ObjectId,         // Reference đến majors
  code: String,              // VD: "A00", "A01"
  name: String,              // VD: "Khối Toán - Vật Lý - Hóa"
  subjects: [String],        // ["Toán", "Vật Lý", "Hóa Học"]
  description: String,
  year: Number,              // Năm tuyển sinh: 2024, 2025, ...
  isActive: Boolean,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.admissionBlocks.createIndex({ majorId: 1 })
db.admissionBlocks.createIndex({ code: 1 })
db.admissionBlocks.createIndex({ year: 1, majorId: 1 })
```

---

### 4. **quotas** - Chỉ Tiêu Tuyển Sinh

```javascript
{
  _id: ObjectId,
  admissionBlockId: ObjectId, // Reference đến admissionBlocks
  majorId: ObjectId,          // Reference đến majors (denormalize for query speed)
  quota: Number,              // Số lượng chỉ tiêu
  enrolled: Number,           // Số đã nhập học (cập nhật sau tuyển sinh)
  available: Number,          // Số còn trống = quota - enrolled
  year: Number,               // Năm tuyển sinh
  priority: Number,           // Thứ tự ưu tiên (1, 2, 3...)
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.quotas.createIndex({ admissionBlockId: 1 })
db.quotas.createIndex({ majorId: 1 })
db.quotas.createIndex({ year: 1, majorId: 1 })
```

---

### 5. **applications** - Hồ Sơ Tuyển Sinh

```javascript
{
  _id: ObjectId,
  applicationNumber: String,  // VD: "TS2025001" (unique, auto-increment)
  admissionBlockId: ObjectId, // Reference đến admissionBlocks
  majorId: ObjectId,          // Reference đến majors
  schoolId: ObjectId,         // Reference đến schools
  
  // Thông tin cá nhân
  personalInfo: {
    fullName: String,
    dateOfBirth: ISODate,
    gender: String,            // "M" | "F"
    nationalId: String,        // CMND/CCCD
    phoneNumber: String,
    email: String,
    address: String,
    hometown: String
  },
  
  // Thành tích học tập
  academicInfo: {
    highSchoolCode: String,    // Mã trường THPT
    highSchoolName: String,
    graduationYear: Number,
    mathScore: Number,         // Điểm môn Toán
    physicsScore: Number,      // Điểm môn Vật Lý
    chemistryScore: Number,    // Điểm môn Hóa
    biologyScore: Number,
    historicalScore: Number,
    geographyScore: Number,
    literatureScore: Number,
    englishScore: Number,
    specialScore: Number,      // Điểm đặc biệt (nếu có)
    gpa: Number                // GPA trung bình
  },
  
  // Kết quả xét tuyển
  admissionResult: {
    totalScore: Number,        // Tổng điểm = (Toán + Vật Lý + Hóa)/3 + điểm ưu tiên
    priorityPoints: Number,    // Điểm ưu tiên khu vực, đối tượng
    finalScore: Number,        // Điểm xét tuyển cuối cùng
    status: String,            // "pending" | "accepted" | "rejected" | "waitlisted"
    resultDate: ISODate,
    note: String               // Ghi chú từ cán bộ tuyển sinh
  },
  
  // Trạng thái xử lý
  processStatus: String,       // "submitted" | "verified" | "scoring" | "completed"
  completionPercentage: Number, // 0-100 (% hoàn thành hồ sơ)
  
  // Đăng ký khối khác (nếu có)
  alternateChoices: [
    {
      admissionBlockId: ObjectId,
      priority: Number         // Ưu tiên thứ 1, 2, 3...
    }
  ],
  
  isActive: Boolean,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.applications.createIndex({ applicationNumber: 1 }, { unique: true })
db.applications.createIndex({ admissionBlockId: 1 })
db.applications.createIndex({ majorId: 1 })
db.applications.createIndex({ schoolId: 1 })
db.applications.createIndex({ "personalInfo.email": 1 })
db.applications.createIndex({ "admissionResult.status": 1 })
db.applications.createIndex({ "admissionResult.totalScore": -1 })
db.applications.createIndex({ createdAt: -1 })
db.applications.createIndex({ 
  admissionBlockId: 1, 
  "admissionResult.status": 1 
})
```

---

### 6. **users** - Quản Lý Người Dùng (Admin)

```javascript
{
  _id: ObjectId,
  username: String,          // Unique username
  email: String,             // Unique email
  hashedPassword: String,    // Bcrypt hashed
  fullName: String,
  role: String,              // "admin" | "staff" | "manager" | "viewer"
  schoolId: [ObjectId],      // Mảng schools mà user quản lý (nếu role = staff)
  
  permissions: {
    canCreateSchool: Boolean,
    canEditSchool: Boolean,
    canDeleteSchool: Boolean,
    canManageMajors: Boolean,
    canManageAdmissionBlocks: Boolean,
    canReviewApplications: Boolean,
    canExportData: Boolean
  },
  
  isActive: Boolean,
  lastLogin: ISODate,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

---

### 7. **statistics** - Dữ Liệu Thống Kê (Aggregation Cache)

```javascript
{
  _id: ObjectId,
  type: String,              // "daily" | "monthly" | "yearly"
  date: ISODate,
  schoolId: ObjectId,        // Optional: nếu là thống kê riêng trường
  
  metrics: {
    totalApplications: Number,
    acceptedApplications: Number,
    rejectedApplications: Number,
    waitlistedApplications: Number,
    pendingApplications: Number,
    averageScore: Number,
    scoreDistribution: {     // Phân bố điểm
      "0-5": Number,
      "5-10": Number,
      "10-15": Number,
      "15-20": Number,
      "20-25": Number,
      "25+": Number
    }
  },
  
  majorStats: [
    {
      majorId: ObjectId,
      applications: Number,
      accepted: Number,
      ratio: Number          // % nhận vào
    }
  ],
  
  createdAt: ISODate
}
```

**Indexes:**
```javascript
db.statistics.createIndex({ type: 1, date: -1 })
db.statistics.createIndex({ schoolId: 1, type: 1 })
```

---

### 8. **documents** - Tài Liệu Hồ Sơ (Optional)

```javascript
{
  _id: ObjectId,
  applicationId: ObjectId,   // Reference đến applications
  documentType: String,      // "transcript" | "certificate" | "passport" | "photo"
  fileName: String,
  fileUrl: String,           // URL trên cloud storage (AWS S3, Google Cloud, etc.)
  mimeType: String,          // "image/jpeg", "application/pdf", etc.
  fileSize: Number,          // Bytes
  uploadedBy: ObjectId,      // Reference đến users
  isVerified: Boolean,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

**Indexes:**
```javascript
db.documents.createIndex({ applicationId: 1 })
db.documents.createIndex({ documentType: 1, applicationId: 1 })
```

---

### 9. **notifications** - Thông Báo Hệ Thống

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,     // Reference đến users (admin nhận)
  type: String,              // "application_submitted" | "status_changed" | "quota_full"
  title: String,
  message: String,
  relatedId: ObjectId,       // ID của bản ghi liên quan (application, etc.)
  relatedType: String,       // "application" | "school" | "major"
  isRead: Boolean,
  createdAt: ISODate
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ recipientId: 1, isRead: 1 })
db.notifications.createIndex({ createdAt: -1 })
```

---

## 🔗 Relationships & Foreign Keys

| Collection | Field | References | Cardinality |
|-----------|-------|-----------|------------|
| majors | schoolId | schools._id | Many-to-One |
| admissionBlocks | majorId | majors._id | Many-to-One |
| quotas | admissionBlockId | admissionBlocks._id | One-to-One |
| quotas | majorId | majors._id | Many-to-One |
| applications | admissionBlockId | admissionBlocks._id | Many-to-One |
| applications | majorId | majors._id | Many-to-One |
| applications | schoolId | schools._id | Many-to-One |
| users | schoolId | schools._id | Many-to-Many |
| documents | applicationId | applications._id | Many-to-One |
| documents | uploadedBy | users._id | Many-to-One |

---

## 📊 Ví Dụ Aggregation Queries

### 1. Thống kê hồ sơ theo trạng thái

```javascript
db.applications.aggregate([
  {
    $group: {
      _id: "$admissionResult.status",
      count: { $sum: 1 },
      avgScore: { $avg: "$admissionResult.totalScore" }
    }
  },
  { $sort: { count: -1 } }
])
```

### 2. Top 10 hồ sơ điểm cao nhất

```javascript
db.applications.find({
  "admissionResult.status": "accepted"
}).sort({ "admissionResult.totalScore": -1 }).limit(10)
```

### 3. Thống kê quota vs applications

```javascript
db.applications.aggregate([
  { $match: { "admissionResult.status": "accepted" } },
  {
    $group: {
      _id: "$admissionBlockId",
      accepted: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "quotas",
      localField: "_id",
      foreignField: "admissionBlockId",
      as: "quota_info"
    }
  },
  {
    $project: {
      admissionBlockId: "$_id",
      accepted: 1,
      quota: { $arrayElemAt: ["$quota_info.quota", 0] },
      _id: 0
    }
  }
])
```

### 4. Lấy toàn bộ thông tin hồ sơ với chi tiết ngành & trường

```javascript
db.applications.aggregate([
  {
    $lookup: {
      from: "admissionBlocks",
      localField: "admissionBlockId",
      foreignField: "_id",
      as: "blockInfo"
    }
  },
  {
    $lookup: {
      from: "majors",
      localField: "majorId",
      foreignField: "_id",
      as: "majorInfo"
    }
  },
  {
    $lookup: {
      from: "schools",
      localField: "schoolId",
      foreignField: "_id",
      as: "schoolInfo"
    }
  },
  { $unwind: "$blockInfo" },
  { $unwind: "$majorInfo" },
  { $unwind: "$schoolInfo" },
  {
    $match: {
      "admissionResult.status": "accepted"
    }
  }
])
```

---

## 🔐 Security Recommendations

1. **Encryption**: 
   - Mã hóa sensitive fields: nationalId, email, phoneNumber (nếu cần)
   - Sử dụng MongoDB Field Level Encryption

2. **Access Control**:
   - Implement role-based access control (RBAC)
   - Database-level users: một user cho backend, không dùng admin account

3. **Audit Trail**:
   - Thêm `lastModifiedBy` và `modificationReason` vào các documents
   - Sử dụng MongoDB Change Streams để log mọi thay đổi

4. **Backup**:
   - Enable automated backups trên MongoDB Atlas
   - Point-in-time restore

---

## 📈 Performance Optimization

### Connection Pooling
```javascript
// Trong Node.js backend
const client = new MongoClient(uri, {
  maxPoolSize: 50,
  minPoolSize: 10
});
```

### Bulk Operations
```javascript
// Import hàng loạt hồ sơ
const bulkOps = applications.map(app => ({
  insertOne: { document: app }
}));
db.applications.bulkWrite(bulkOps);
```

### Text Search Index (nếu cần tìm kiếm)
```javascript
db.applications.createIndex({
  "personalInfo.fullName": "text",
  "personalInfo.email": "text",
  "applicationNumber": "text"
})
```

---

## 🚀 MongoDB Atlas Setup Steps

1. **Tạo M0 Cluster (Free tier)**:
   - Truy cập mongodb.com/cloud/atlas
   - Sign up / Login
   - Create Project → Create Cluster

2. **Network Access**:
   - Add IP Address (0.0.0.0/0 cho development, specific IPs cho production)

3. **Database User**:
   - Create user: `admission_api`
   - Password: Strong password
   - Permissions: readWriteAnyDatabase

4. **Connection String**:
   ```
   mongodb+srv://admission_api:<password>@cluster0.xxxxx.mongodb.net/admission_system?retryWrites=true&w=majority
   ```

5. **Backups**:
   - Enable Continuous Backups
   - Test restore procedures

---

## 📝 Migration từ MySQL

Nếu có dữ liệu từ MySQL, có thể sử dụng tools:
- **MongoDB Compass**: Dùng aggregation pipeline để transform dữ liệu
- **Mongoexport/mongoimport**: CLI tools
- **Custom Node.js script**: Đọc từ MySQL, ghi vào MongoDB

---

## 🔄 Next Steps

1. Tạo database trên MongoDB Atlas
2. Implement schemas này trong backend (Node.js + Mongoose hoặc native driver)
3. Tạo API endpoints cho CRUD operations
4. Thêm validation & error handling
5. Setup authentication & authorization
6. Implement caching strategy (Redis)
7. Monitor & optimize queries dùng MongoDB Atlas Performance Advisor
