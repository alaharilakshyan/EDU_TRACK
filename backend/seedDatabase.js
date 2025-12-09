const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const University = require('./models/University');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alaharilakshyan_db_user:rpzEkbw7o0Gx9J3k@cluster0.iefys1f.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to preserve existing data)
    // await User.deleteMany({});
    // await University.deleteMany({});

    // Create default university if it doesn't exist
    let university = await University.findOne({ name: 'Default University' });
    if (!university) {
      university = new University({
        name: 'Default University',
        country: 'United States',
        domain: 'default.edu',
        apiId: 'DEFAULT_UNI_001',
        isActive: true,
        settings: {
          allowStudentRegistration: true,
          requireEmailVerification: false,
          defaultStudentRole: 'student'
        }
      });
      await university.save();
      console.log('Default university created');
    } else {
      console.log('Default university already exists');
    }

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@default.edu';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      // Generate a unique UID7
      const uid7 = 'ADM' + Date.now().toString().slice(-6);
      
      adminUser = new User({
        uid7: uid7,
        email: adminEmail,
        passwordHash: 'Admin123!@#', // This will be hashed by the pre-save hook
        role: 'admin',
        universityId: university._id,
        isActive: true,
        emailVerified: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
      console.log('Admin credentials:');
      console.log('Email:', adminEmail);
      console.log('Password: Admin123!@#');
      console.log('UID7:', uid7);
    } else {
      console.log('Admin user already exists');
    }

    // Create a test faculty user
    const facultyEmail = 'faculty@default.edu';
    let facultyUser = await User.findOne({ email: facultyEmail });
    
    if (!facultyUser) {
      const uid7 = 'FAC' + Date.now().toString().slice(-6);
      
      facultyUser = new User({
        uid7: uid7,
        email: facultyEmail,
        passwordHash: 'Faculty123!@#',
        role: 'faculty',
        universityId: university._id,
        isActive: true,
        emailVerified: true
      });

      await facultyUser.save();
      console.log('Faculty user created successfully');
      console.log('Faculty credentials:');
      console.log('Email:', facultyEmail);
      console.log('Password: Faculty123!@#');
      console.log('UID7:', uid7);
    } else {
      console.log('Faculty user already exists');
    }

    // Create a test student user
    const studentEmail = 'student@default.edu';
    let studentUser = await User.findOne({ email: studentEmail });
    
    if (!studentUser) {
      const uid7 = 'STU' + Date.now().toString().slice(-6);
      
      studentUser = new User({
        uid7: uid7,
        email: studentEmail,
        passwordHash: 'Student123!@#',
        role: 'student',
        universityId: university._id,
        isActive: true,
        emailVerified: true
      });

      await studentUser.save();
      console.log('Student user created successfully');
      console.log('Student credentials:');
      console.log('Email:', studentEmail);
      console.log('Password: Student123!@#');
      console.log('UID7:', uid7);
    } else {
      console.log('Student user already exists');
    }

    console.log('\nDatabase seeding completed!');
    console.log('\nLogin Credentials:');
    console.log('==================');
    console.log('Admin: admin@default.edu / Admin123!@#');
    console.log('Faculty: faculty@default.edu / Faculty123!@#');
    console.log('Student: student@default.edu / Student123!@#');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seed function
seedDatabase();
