import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { initializeGridFS } from './config/gridfs';
import apiRoutes from './routes/api.routes';
import fileRoutes from './routes/files.routes';
import { apiRateLimit } from './middleware/rateLimit';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

app.use('/api/files', fileRoutes);

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Lỗi máy chủ nội bộ'
  });
});

app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

async function startServer() {
  try {
    await connectDB();

    initializeGridFS(mongoose);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server chạy tại http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api`);
      console.log(`Authentication: Xem API_AUTHENTICATION.md`);
      console.log(`File Upload: POST /api/files/applications/:applicationId/upload`);
    });
  } catch (error) {
    console.error('Lỗi khởi động server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
