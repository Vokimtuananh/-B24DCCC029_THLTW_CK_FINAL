import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Models
const schoolSchema = new mongoose.Schema({
    schoolCode: String,
    schoolName: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

const majorSchema = new mongoose.Schema({
    majorCode: String,
    majorName: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const admissionBlockSchema = new mongoose.Schema({
    blockCode: String,
    blockName: String,
    subjectCodes: [String],
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
    applicationNumber: String,
    personalInfo: {
        fullName: String,
        dateOfBirth: Date,
        gender: String,
        email: String,
        phoneNumber: String,
        address: String
    },
    academicInfo: {
        highSchoolName: String,
        graduationYear: Number,
        gpa: Number,
        transcript: String
    },
    admissionInfo: {
        school: mongoose.Schema.Types.ObjectId,
        major: mongoose.Schema.Types.ObjectId,
        admissionBlock: mongoose.Schema.Types.ObjectId,
        priorityLevel: String
    },
    admissionResult: {
        status: { type: String, enum: ['pending', 'accepted', 'rejected', 'waitlisted'], default: 'pending' },
        decisionDate: Date,
        notes: String
    },
    documents: [String],
    submittedDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const School = mongoose.model('School', schoolSchema);
const Major = mongoose.model('Major', majorSchema);
const AdmissionBlock = mongoose.model('AdmissionBlock', admissionBlockSchema);
const Application = mongoose.model('Application', applicationSchema);

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || '', {
            maxPoolSize: 50,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await School.deleteMany({});
        await Major.deleteMany({});
        await AdmissionBlock.deleteMany({});
        await Application.deleteMany({});
        console.log('✅ Cleared existing data');

        // Seed Schools
        const schools = await School.insertMany([
            {
                schoolCode: 'PTIT',
                schoolName: 'Học viện Công nghệ Bưu chính Viễn thông',
                address: 'Km 20 Đại lộ Thăng Long, Hà Nội'
            },
            {
                schoolCode: 'HUT',
                schoolName: 'Đại học Bách khoa Hà Nội',
                address: 'Số 1 Đại Cồ Việt, Hà Nội'
            },
            {
                schoolCode: 'VNU',
                schoolName: 'Đại học Quốc gia Hà Nội',
                address: 'Nguyễn Trãi, Hà Nội'
            }
        ]);
        console.log(`✅ Seeded ${schools.length} schools`);

        // Seed Majors
        const majors = await Major.insertMany([
            {
                majorCode: 'IT',
                majorName: 'Công nghệ Thông tin',
                description: 'Ngành đào tạo công nghệ thông tin'
            },
            {
                majorCode: 'EE',
                majorName: 'Kỹ thuật Điện',
                description: 'Ngành đào tạo kỹ thuật điện'
            },
            {
                majorCode: 'ME',
                majorName: 'Kỹ thuật Cơ khí',
                description: 'Ngành đào tạo kỹ thuật cơ khí'
            },
            {
                majorCode: 'CE',
                majorName: 'Kỹ thuật Xây dựng',
                description: 'Ngành đào tạo kỹ thuật xây dựng'
            }
        ]);
        console.log(`✅ Seeded ${majors.length} majors`);

        // Seed Admission Blocks
        const blocks = await AdmissionBlock.insertMany([
            {
                blockCode: 'A',
                blockName: 'Khối A',
                subjectCodes: ['Toán', 'Lý', 'Hóa'],
                description: 'Khối thi A - Toán, Lý, Hóa'
            },
            {
                blockCode: 'B',
                blockName: 'Khối B',
                subjectCodes: ['Toán', 'Hóa', 'Sinh'],
                description: 'Khối thi B - Toán, Hóa, Sinh'
            },
            {
                blockCode: 'C',
                blockName: 'Khối C',
                subjectCodes: ['Văn', 'Sử', 'Địa'],
                description: 'Khối thi C - Văn, Sử, Địa'
            }
        ]);
        console.log(`✅ Seeded ${blocks.length} admission blocks`);

        // Seed Applications
        const applications = await Application.insertMany([
            {
                applicationNumber: 'APP-001',
                personalInfo: {
                    fullName: 'Nguyễn Văn A',
                    dateOfBirth: new Date('2004-01-15'),
                    gender: 'Nam',
                    email: 'nguyenvana@email.com',
                    phoneNumber: '0901234567',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Chuyên Hà Nội - Amsterdam',
                    graduationYear: 2024,
                    gpa: 9.5,
                    transcript: 'Chứng chỉ học bạ'
                },
                admissionInfo: {
                    school: schools[0]._id,
                    major: majors[0]._id,
                    admissionBlock: blocks[0]._id,
                    priorityLevel: 'high'
                },
                admissionResult: {
                    status: 'pending',
                    notes: 'Chờ xét duyệt'
                }
            },
            {
                applicationNumber: 'APP-002',
                personalInfo: {
                    fullName: 'Trần Thị B',
                    dateOfBirth: new Date('2004-03-20'),
                    gender: 'Nữ',
                    email: 'tranthib@email.com',
                    phoneNumber: '0912345678',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Nguyễn Huệ',
                    graduationYear: 2024,
                    gpa: 8.8,
                    transcript: 'Chứng chỉ học bạ'
                },
                admissionInfo: {
                    school: schools[1]._id,
                    major: majors[1]._id,
                    admissionBlock: blocks[1]._id,
                    priorityLevel: 'medium'
                },
                admissionResult: {
                    status: 'pending',
                    notes: 'Chờ xét duyệt'
                }
            },
            {
                applicationNumber: 'APP-003',
                personalInfo: {
                    fullName: 'Lê Văn C',
                    dateOfBirth: new Date('2005-05-10'),
                    gender: 'Nam',
                    email: 'levanc@email.com',
                    phoneNumber: '0923456789',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Phan Bội Châu',
                    graduationYear: 2024,
                    gpa: 8.2,
                    transcript: 'Chứng chỉ học bạ'
                },
                admissionInfo: {
                    school: schools[0]._id,
                    major: majors[2]._id,
                    admissionBlock: blocks[0]._id,
                    priorityLevel: 'low'
                },
                admissionResult: {
                    status: 'pending',
                    notes: 'Chờ xét duyệt'
                }
            },
            {
                applicationNumber: 'APP-004',
                personalInfo: {
                    fullName: 'Phạm Thị D',
                    dateOfBirth: new Date('2004-07-25'),
                    gender: 'Nữ',
                    email: 'phamthid@email.com',
                    phoneNumber: '0934567890',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Lê Quý Đôn',
                    graduationYear: 2024,
                    gpa: 9.0,
                    transcript: 'Chứng chỉ học bạ'
                },
                admissionInfo: {
                    school: schools[2]._id,
                    major: majors[3]._id,
                    admissionBlock: blocks[2]._id,
                    priorityLevel: 'high'
                },
                admissionResult: {
                    status: 'accepted',
                    decisionDate: new Date(),
                    notes: 'Đã chấp nhận'
                }
            },
            {
                applicationNumber: 'APP-005',
                personalInfo: {
                    fullName: 'Đỗ Văn E',
                    dateOfBirth: new Date('2005-09-08'),
                    gender: 'Nam',
                    email: 'dovane@email.com',
                    phoneNumber: '0945678901',
                    address: 'Hà Nội'
                },
                academicInfo: {
                    highSchoolName: 'THPT Kim Liên',
                    graduationYear: 2024,
                    gpa: 7.5,
                    transcript: 'Chứng chỉ học bạ'
                },
                admissionInfo: {
                    school: schools[1]._id,
                    major: majors[0]._id,
                    admissionBlock: blocks[1]._id,
                    priorityLevel: 'medium'
                },
                admissionResult: {
                    status: 'rejected',
                    decisionDate: new Date(),
                    notes: 'Không đạt điểm chuẩn'
                }
            }
        ]);
        console.log(`✅ Seeded ${applications.length} applications`);

        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
