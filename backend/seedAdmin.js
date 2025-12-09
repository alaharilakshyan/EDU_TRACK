const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const University = require('./models/University');
const FacultyProfile = require('./models/FacultyProfile');

const seedAdmin = async () => {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://alaharilakshyan_db_user:rpzEkbw7o0Gx9J3k@cluster0.iefys1f.mongodb.net/';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@studentplatform.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create or get university
    let university = await University.findOne({ name: 'Demo University' });
    if (!university) {
      university = new University({
        name: 'Demo University',
        country: 'United States',
        domain: 'demo.edu',
        apiId: 'demo-university-001',
        isActive: true
      });
      await university.save();
      console.log('Created demo university');
    }

    // Create admin user
    const adminUser = new User({
      uid7: '1000001', // Fixed admin ID for easy access
      email: 'admin@studentplatform.com',
      passwordHash: 'Admin123!', // This will be hashed by the pre-save middleware
      role: 'admin',
      universityId: university._id,
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('Created admin user');
    console.log('Email: admin@studentplatform.com');
    console.log('Password: Admin123!');

    // Create a demo faculty user
    const facultyUser = new User({
      uid7: '2000001',
      email: 'faculty@demo.edu',
      passwordHash: 'Faculty123!',
      role: 'faculty',
      universityId: university._id,
      isActive: true,
      emailVerified: true
    });

    await facultyUser.save();

    // Create faculty profile
    const facultyProfile = new FacultyProfile({
      userId: facultyUser._id,
      fullName: 'Dr. John Smith',
      department: 'Computer Science',
      designation: 'Professor',
      employeeId: 'EMP001',
      specialization: ['Artificial Intelligence', 'Machine Learning'],
      joinDate: new Date('2020-01-15'),
      isActive: true
    });

    await facultyProfile.save();

    // Update faculty user with profile reference
    facultyUser.profileRef = facultyProfile._id;
    facultyUser.roleModel = 'FacultyProfile';
    await facultyUser.save();

    console.log('Created demo faculty user');
    console.log('Email: faculty@demo.edu');
    console.log('Password: Faculty123!');

    console.log('\nSeeding completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@studentplatform.com / Admin123!');
    console.log('Faculty: faculty@demo.edu / Faculty123!');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
