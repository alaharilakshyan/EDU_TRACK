# Student Activity Platform - Local Development

A comprehensive web platform for tracking, verifying, and showcasing student activities across Higher Education Institutions (HEIs).

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Run the setup script
scripts\setup.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-activity-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

### Configuration

#### Backend Environment (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-activity-platform
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Student Activity Platform
```

### Running the Application

#### Option 1: Start Scripts

**Windows:**
```bash
scripts\start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

#### Option 2: Manual Start

1. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (update .env with connection string)
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## Development Workflow

### File Structure
```
student-activity-platform/
├── backend/                 # Node.js/Express API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── services/           # Business logic
│   └── utils/              # Helper functions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
└── scripts/                # Setup and start scripts
```

### Common Commands

**Backend:**
```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
```

**Frontend:**
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Check code style
npm run format       # Format code with Prettier
```

## Features

### Student Portal
- Dashboard with activity overview
- Profile management with linked accounts
- Activity heatmap visualization
- Document upload (certificates, reports, internships)
- CV upload with AI-powered ATS scoring

### Faculty Portal
- Student management and search
- Verification workflow for submissions
- Activity tracking and event creation
- Student analytics dashboard

### Admin Portal
- User management across all roles
- University management
- Comprehensive audit logs
- System analytics and monitoring

## API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Student Endpoints
- `GET /api/students/:uid7/profile` - Get profile
- `POST /api/students/:uid7/upload/certificate` - Upload certificate
- `POST /api/students/:uid7/cv/score` - Score CV

### Faculty Endpoints
- `GET /api/faculty/:uid7/students` - List students
- `POST /api/faculty/:uid7/approve/:itemId` - Approve submission

### Admin Endpoints
- `GET /api/admin/users` - List users
- `POST /api/admin/create-user` - Create user

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Try MongoDB Atlas as alternative

2. **Port Already in Use**
   ```bash
   # Find process using port
   netstat -ano | findstr :5000
   # Kill process
   taskkill /PID <PID> /F
   ```

3. **Module Not Found**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS Errors**
   - Check FRONTEND_URL in backend .env
   - Ensure frontend is running on correct port

### Getting Help

1. Check console logs for detailed error messages
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check network connectivity for external APIs

## Production Deployment

For production deployment, consider:
- Using PM2 for process management
- Setting up reverse proxy with Nginx
- Configuring SSL certificates
- Setting up monitoring and logging
- Using MongoDB Atlas for database

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper testing
4. Submit pull request

## License

MIT License - see LICENSE file for details.
