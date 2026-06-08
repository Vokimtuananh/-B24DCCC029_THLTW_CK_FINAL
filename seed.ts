import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {
    School,
    Major,
    AdmissionBlock,
    Application,
    User
} from './src/models/mongoose.models';

dotenv.config();

const seedDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI is not defined in .env file');
            process.exit(1);
        }

        console.log('⏳ Connecting to MongoDB Atlas...');
        await mongoose.connect(uri, {
            maxPoolSize: 50,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        });

        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await School.deleteMany({});
        await Major.deleteMany({});
        await AdmissionBlock.deleteMany({});
        await Application.deleteMany({});
        await User.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create Admin User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@admission.vn',
            hashedPassword,
            fullName: 'Administrator',
            role: 'admin',
            isActive: true
        });
        console.log('✅ Seeded admin user (admin/admin123)');

        // Seed Schools
        const schools = await School.insertMany([
            {
                code: 'PTIT',
                name: 'Học viện Công nghệ Bưu chính Viễn thông',
                address: 'Km 20 Đại lộ Thăng Long, Hà Nội',
                isActive: true
            },
            {
                code: 'HUST',
                name: 'Đại học Bách khoa Hà Nội',
                address: 'Số 1 Đại Cồ Việt, Hà Nội',
                isActive: true
            },
            {
                code: 'VNU',
                name: 'Đại học Quốc gia Hà Nội',
                address: '144 Xuân Thủy, Cầu Giấy, Hà Nội',
                isActive: true
            }
        ]);
        console.log(`✅ Seeded ${schools.length} schools`);

        // Seed Majors
        const majors = await Major.insertMany([
            {
                schoolId: schools[0]._id,
                code: 'IT',
                name: 'Công nghệ Thông tin',
                description: 'Ngành đào tạo công nghệ thông tin',
                isActive: true
            },
            {
                schoolId: schools[1]._id,
                code: 'EE',
                name: 'Kỹ thuật Điện',
                description: 'Ngành đào tạo kỹ thuật điện',
                isActive: true
            },
            {
                schoolId: schools[2]._id,
                code: 'CS',
                name: 'Khoa học Máy tính',
                description: 'Ngành đào tạo khoa học máy tính',
                isActive: true
            }
        ]);
        console.log(`✅ Seeded ${majors.length} majors`);

        // Seed Admission Blocks
        const blocks = await AdmissionBlock.insertMany([
            {
                majorId: majors[0]._id,
                code: 'A00',
                name: 'Khối A00',
                subjects: ['Toán', 'Lý', 'Hóa'],
                year: 2024,
                isActive: true
            },
            {
                majorId: majors[1]._id,
                code: 'A01',
                name: 'Khối A01',
                subjects: ['Toán', 'Lý', 'Anh'],
                year: 2024,
                isActive: true
            },
            {
                majorId: majors[2]._id,
                code: 'D01',
                name: 'Khối D01',
                subjects: ['Toán', 'Văn', 'Anh'],
                year: 2024,
                isActive: true
            }
        ]);
        console.log(`✅ Seeded ${blocks.length} admission blocks`);

        // Seed Applications
        const applications = await Application.insertMany([
            {
                applicationNumber: 'APP-001',
                schoolId: schools[0]._id,
                majorId: majors[0]._id,
                admissionBlockId: blocks[0]._id,
                personalInfo: {
                    fullName: 'Nguyễn Văn A',
                    dateOfBirth: new Date('2004-01-15'),
                    gender: 'M',
                    email: 'nguyenvana@email.com',
                    phoneNumber: '0901234567',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Chuyên Hà Nội - Amsterdam',
                    graduationYear: 2024,
                    gpa: 9.5,
                    mathScore: 9.0,
                    physicsScore: 8.5,
                    chemistryScore: 9.0
                },
                admissionResult: {
                    status: 'pending',
                    totalScore: 8.83
                },
                processStatus: 'submitted',
                completionPercentage: 100,
                isActive: true
            },
            {
                applicationNumber: 'APP-002',
                schoolId: schools[1]._id,
                majorId: majors[1]._id,
                admissionBlockId: blocks[1]._id,
                personalInfo: {
                    fullName: 'Trần Thị B',
                    dateOfBirth: new Date('2004-03-20'),
                    gender: 'F',
                    email: 'tranthib@email.com',
                    phoneNumber: '0912345678',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Nguyễn Huệ',
                    graduationYear: 2024,
                    gpa: 8.8,
                    mathScore: 8.5,
                    physicsScore: 8.0,
                    chemistryScore: 9.5
                },
                admissionResult: {
                    status: 'pending',
                    totalScore: 8.67
                },
                processStatus: 'submitted',
                completionPercentage: 100,
                isActive: true
            }
        ]);
        console.log(`✅ Seeded ${applications.length} applications`);

        console.log('\n🚀 Database seeding completed successfully to MongoDB Atlas!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
