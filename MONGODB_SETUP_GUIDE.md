# MongoDB Atlas Setup & Integration Guide
## Hướng dẫn Chi Tiết Thiết Lập MongoDB

---

## 📋 Table of Contents

1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Database Configuration](#database-configuration)
3. [Backend Integration](#backend-integration)
4. [API Usage Examples](#api-usage-examples)
5. [Performance Tips](#performance-tips)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Truy cập [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Đăng ký account (hoặc đăng nhập nếu đã có)

### Step 2: Create Project

1. Trong dashboard, click "Create a project"
2. Nhập tên project: `admission-system` hoặc bất kỳ tên nào
3. Click "Create Project"

### Step 3: Create Cluster

1. Click "Build a Database"
2. Chọn **M0 Cluster** (Free tier - đủ để develop/test)
   - 512MB storage
   - Shared RAM
   - Không có backup
3. Chọn Cloud Provider: **AWS** hoặc **Google Cloud**
4. Chọn Region gần nhất: Nếu ở Việt Nam, chọn Singapore hoặc Tokyo
5. Cluster Name: `admission-cluster`
6. Click "Create Cluster"

⏳ Chờ 1-3 phút để cluster được khởi tạo

### Step 4: Setup Network Access

1. Trong sidebar, click "Network Access"
2. Click "Add IP Address"
3. Chọn "Allow access from anywhere" (0.0.0.0/0) cho development
   - ⚠️ Trong production, thay bằng specific IP của server
4. Click "Confirm"

### Step 5: Create Database User

1. Trong sidebar, click "Database Access"
2. Click "Add New Database User"
3. Nhập Username: `admission_api`
4. Password: Sinh auto hoặc nhập password mạnh
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### Step 6: Get Connection String

1. Trở lại cluster view, click "Connect"
2. Chọn "Drivers"
3. Chọn Language: "Node.js"
4. Copy connection string:
   ```
   mongodb+srv://admission_api:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🔧 Database Configuration

### Install Dependencies

```bash
npm install mongoose dotenv bcrypt
npm install --save-dev @types/mongoose @types/node
```

### Create `.env` File

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://admission_api:your_password@cluster0.xxxxx.mongodb.net/admission_system?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

⚠️ **IMPORTANT**: Thêm `.env` vào `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Create Main Server File

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, initializeDatabase, seedDatabase } from './config/database';
import apiRoutes from './routes/api.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
(async () => {
  await connectDB();
  
  // Initialize indexes (chạy 1 lần)
  // await initializeDatabase();
  
  // Seed sample data (chỉ chạy nếu database rỗng)
  // await seedDatabase();
})();

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 🔌 Backend Integration

### Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection & initialization
├── models/
│   └── mongoose.models.ts   # All Mongoose schemas
├── routes/
│   └── api.routes.ts        # API endpoints
├── middleware/
│   └── auth.ts              # JWT authentication
├── services/
│   └── statistics.ts        # Background jobs for stats
└── server.ts                # Main entry point
```

### Full Server Setup Example

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import apiRoutes from './routes/api.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error'
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "tsx src/config/database.ts"
  }
}
```

---

## 📡 API Usage Examples

### Frontend Integration (React + Redux)

```typescript
// src/services/admissionApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const admissionApi = {
  // Schools
  getSchools: () => api.get('/schools'),
  createSchool: (data) => api.post('/schools', data),
  updateSchool: (id, data) => api.put(`/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/schools/${id}`),

  // Majors
  getMajorsBySchool: (schoolId) => api.get(`/schools/${schoolId}/majors`),
  createMajor: (data) => api.post('/majors', data),

  // Admission Blocks
  getBlocksByMajor: (majorId) => api.get(`/majors/${majorId}/blocks`),
  createBlock: (data) => api.post('/admission-blocks', data),

  // Applications
  getApplications: (filters) => api.get('/applications', { params: filters }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => api.post('/applications', data),
  updateApplicationScores: (id, data) => api.put(`/applications/${id}/scores`, data),
  updateApplicationStatus: (id, data) => api.put(`/applications/${id}/status`, data),

  // Statistics
  getDashboardStats: (filters) => api.get('/statistics/dashboard', { params: filters }),

  // Search & Export
  searchApplications: (query) => api.get(`/applications/search/${query}`),
  exportApplicationsCSV: (filters) => api.get('/applications/export/csv', { params: filters })
};
```

### Redux Slice Example

```typescript
// src/store/slices/applicationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { admissionApi } from '../../services/admissionApi';

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (filters = {}) => {
    const response = await admissionApi.getApplications(filters);
    return response.data;
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    loading: false,
    error: null,
    total: 0
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default applicationSlice.reducer;
```

---

## 📊 Advanced Queries

### Aggregation Pipeline Examples

```typescript
// Get applications with acceptance rate by major
const majorAcceptanceRate = await Application.aggregate([
  {
    $group: {
      _id: '$majorId',
      total: { $sum: 1 },
      accepted: {
        $sum: {
          $cond: [{ $eq: ['$admissionResult.status', 'accepted'] }, 1, 0]
        }
      }
    }
  },
  {
    $addFields: {
      acceptanceRate: {
        $multiply: [{ $divide: ['$accepted', '$total'] }, 100]
      }
    }
  },
  {
    $lookup: {
      from: 'majors',
      localField: '_id',
      foreignField: '_id',
      as: 'majorDetails'
    }
  }
]);

// Get top performers
const topPerformers = await Application.find({
  'admissionResult.status': 'accepted'
})
  .sort({ 'admissionResult.totalScore': -1 })
  .limit(100)
  .select('applicationNumber personalInfo.fullName admissionResult.totalScore');

// Get applications by score ranges
const scoreDistribution = await Application.aggregate([
  {
    $bucket: {
      groupBy: '$admissionResult.totalScore',
      boundaries: [0, 5, 10, 15, 20, 25],
      default: '25+',
      output: {
        count: { $sum: 1 },
        applications: { $push: '$applicationNumber' }
      }
    }
  }
]);
```

---

## ⚡ Performance Tips

### 1. Connection Pooling

```typescript
const mongoUri = process.env.MONGODB_URI!;
await mongoose.connect(mongoUri, {
  maxPoolSize: 50,      // Maximum 50 connections
  minPoolSize: 10,      // Minimum 10 connections
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});
```

### 2. Pagination for Large Datasets

```typescript
// Always use limit and skip for large collections
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const skip = (page - 1) * limit;

const applications = await Application.find()
  .limit(limit)
  .skip(skip)
  .exec();
```

### 3. Projection to Reduce Data Transfer

```typescript
// Only fetch needed fields
const lightweight = await Application.find()
  .select('applicationNumber personalInfo.fullName admissionResult.status')
  .lean() // Returns plain JS objects, faster than Mongoose docs
  .exec();
```

### 4. Use Lean for Read-Only Queries

```typescript
// 10x faster for read-only queries
const data = await Application.find({ 'admissionResult.status': 'accepted' })
  .lean()
  .exec();
```

### 5. Create Proper Indexes

```typescript
// Check existing indexes
db.applications.getIndexes();

// Add compound index for common filters
db.applications.createIndex({ 
  'admissionResult.status': 1, 
  createdAt: -1 
});
```

### 6. Caching Layer (Redis)

```typescript
import redis from 'redis';

const redisClient = redis.createClient();

export async function getCachedSchools() {
  // Try cache first
  const cached = await redisClient.get('schools:all');
  if (cached) {
    return JSON.parse(cached);
  }

  // If not in cache, fetch from DB
  const schools = await School.find({ isActive: true });

  // Cache for 1 hour
  await redisClient.setEx('schools:all', 3600, JSON.stringify(schools));

  return schools;
}
```

---

## 🐛 Troubleshooting

### Connection Issues

```typescript
// Check connection status
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Disconnected from MongoDB');
});
```

### Common Errors

**Error: "connection refused"**
- Kiểm tra IP address đã được thêm vào Network Access
- Kiểm tra MONGODB_URI chính xác
- Kiểm tra internet connection

**Error: "authentication failed"**
- Kiểm tra username/password chính xác
- Reset password nếu cần

**Error: "500 - Internal Server Error" from API**
- Check server logs: `npm run dev`
- Kiểm tra database connection

### Monitoring

```typescript
// Monitor slow queries (queries > 100ms)
mongoose.connection.on('open', () => {
  mongoose.connection.db!.on('command', (command) => {
    console.log('Command:', command);
  });
});

// Monitor memory usage
setInterval(() => {
  console.log('Memory usage:', process.memoryUsage());
}, 60000); // Every minute
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

✅ DO:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

❌ DON'T:
- Hardcode credentials in code
- Commit `.env` to git
- Share passwords in chat/email

### 2. Database User Permissions

```javascript
// Create limited user for backend API
db.createUser({
  user: "admission_api",
  pwd: "strong_password",
  roles: [
    { role: "readWrite", db: "admission_system" }
  ]
})
```

### 3. Input Validation

```typescript
import { body, validationResult } from 'express-validator';

router.post('/applications', [
  body('personalInfo.fullName').notEmpty().trim().escape(),
  body('personalInfo.email').isEmail().normalizeEmail(),
  body('personalInfo.phoneNumber').isMobilePhone('vi-VN'),
  body('academicInfo.mathScore').isFloat({ min: 0, max: 10 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request...
});
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

---

## 📚 Useful Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Best Practices: https://docs.mongodb.com/manual/reference/bson-type-comparison-order/

---

## 🎯 Next Steps

1. ✅ Create MongoDB Atlas account & cluster
2. ✅ Setup `.env` file with connection string
3. ✅ Install dependencies: `npm install mongoose dotenv bcrypt`
4. ✅ Create backend server with Express
5. ✅ Implement API routes
6. ✅ Test API endpoints with Postman
7. ✅ Integrate with React frontend
8. ✅ Setup authentication (JWT)
9. ✅ Deploy to production (Heroku, Railway, Render)

---

## 📞 Support

Nếu gặp vấn đề:
- Check MongoDB Atlas status: https://status.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
- Stack Overflow: Tag `mongodb` hoặc `mongoose`
