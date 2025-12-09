    # MongoDB Setup Instructions

## Option 1: Install MongoDB Community Server (Recommended)

1. **Download MongoDB**: Go to https://www.mongodb.com/try/download/community
2. **Select Version**: Choose MongoDB Community Server
3. **Select Platform**: Windows
4. **Download and Install**: Run the installer with default settings
5. **Install MongoDB Compass**: Check the box to install Compass during setup

## Option 2: Use MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string

## Start MongoDB Service

### Windows:
1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`

### Or use MongoDB Services:
1. Open Services (services.msc)
2. Find "MongoDB"
3. Right-click -> Start

## Verify Installation

Open Command Prompt and run:
```
mongosh --version
```

Or check if MongoDB is running:
```
mongosh
```

## Create Admin Users

Once MongoDB is running, open MongoDB Compass and connect to `mongodb://localhost:27017`

Then use these commands in the MongoDB Shell:

```javascript
// Create University
db.universities.insertOne({
  name: "Default University",
  country: "United States",
  domain: "default.edu",
  apiId: "DEFAULT_UNI_001",
  isActive: true,
  settings: {
    allowStudentRegistration: true,
    requireEmailVerification: false,
    defaultStudentRole: "student"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Get University ID
const university = db.universities.findOne({name: "Default University"});

// Create Admin User
db.users.insertOne({
  uid7: "ADM001",
  email: "admin@default.edu",
  passwordHash: "Admin123!@#",
  role: "admin",
  universityId: university._id,
  isActive: true,
  emailVerified: true,
  refreshTokens: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create Faculty User
db.users.insertOne({
  uid7: "FAC001",
  email: "faculty@default.edu",
  passwordHash: "Faculty123!@#",
  role: "faculty",
  universityId: university._id,
  isActive: true,
  emailVerified: true,
  refreshTokens: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create Student User
db.users.insertOne({
  uid7: "STU001",
  email: "student@default.edu",
  passwordHash: "Student123!@#",
  role: "student",
  universityId: university._id,
  isActive: true,
  emailVerified: true,
  refreshTokens: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

// Verify Users
db.users.find().pretty();
```

## Login Credentials
- **Admin**: admin@default.edu / Admin123!@#
- **Faculty**: faculty@default.edu / Faculty123!@#
- **Student**: student@default.edu / Student123!@#

## Troubleshooting

### If MongoDB doesn't start:
1. Check if port 27017 is in use
2. Disable Windows Firewall temporarily
3. Run MongoDB as Administrator

### If connection fails:
1. Make sure MongoDB service is running
2. Check connection string: `mongodb://localhost:27017`
3. Try `mongodb://127.0.0.1:27017` instead
