# Student Activity Platform

A comprehensive web platform for tracking, verifying, and showcasing student activities across Higher Education Institutions (HEIs).

## Features

### Student Portal
- **Dashboard**: Overview of activities, notifications, and upcoming events
- **Profile Management**: Personal details, linked accounts, and activity analytics
- **Activity Heatmap**: GitHub-style visualization of daily activities
- **Document Upload**: Certificates, reports, and internships with verification workflow
- **Placement Portal**: CV upload with AI-powered ATS scoring and job matching

### Faculty Portal
- **Student Management**: View and search students by university/department
- **Verification System**: Approve/reject student submissions with audit trail
- **Activity Tracking**: Create and manage university-specific events
- **Analytics Dashboard**: Aggregate student performance metrics

### Admin Portal
- **User Management**: Create, update, and delete user accounts
- **University Management**: Add and manage universities in the system
- **Audit Logs**: Comprehensive tracking of all system activities
- **System Analytics**: Platform-wide usage statistics

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3/MinIO
- **LLM Integration**: OpenAI/Claude for CV scoring
- **Caching**: Redis

### Frontend
- **Framework**: React 18 with hooks
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **UI Components**: Heroicons

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: MongoDB
- **Object Storage**: MinIO
- **Caching**: Redis

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-activity-platform
   ```

2. **Environment Setup**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MinIO Console: http://localhost:9001
   - MongoDB: localhost:27017

### Development Setup

#### Backend Development
```bash
cd backend
npm install
npm run dev
```

#### Frontend Development
```bash
cd frontend
npm install
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Student Endpoints
- `GET /api/students/:uid7/profile` - Get student profile
- `PUT /api/students/:uid7/profile` - Update student profile
- `POST /api/students/:uid7/upload/certificate` - Upload certificate
- `POST /api/students/:uid7/cv/score` - Score CV with AI

### Faculty Endpoints
- `GET /api/faculty/:uid7/students` - List students
- `POST /api/faculty/:uid7/approve/:itemId` - Approve submission
- `POST /api/faculty/:uid7/reject/:itemId` - Reject submission

### Admin Endpoints
- `GET /api/admin/users` - List users
- `POST /api/admin/create-user` - Create user
- `GET /api/admin/audit-logs` - View audit logs

## Database Schema

### Core Models
- **User**: Authentication and role management
- **StudentProfile**: Student-specific data and analytics
- **FacultyProfile**: Faculty-specific data
- **University**: Institution information
- **ActivityEvent**: Activity tracking for heatmap
- **Certificate**: Student certificates with verification
- **CVVersion**: CV versions with ATS scoring

## LLM Integration

### CV Scoring Algorithm
The platform uses AI to score student CVs against job descriptions:

1. **Skill Matching**: 40% weight
2. **Experience**: 20% weight  
3. **Education**: 15% weight
4. **Activity Score**: 10% weight
5. **Certifications**: 10% weight
6. **Verification Ratio**: 5% weight

### Prompt Engineering
Custom prompts are used to extract structured data and compute ATS scores with fallback scoring for reliability.

## Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting on all endpoints
- File upload validation and virus scanning
- Comprehensive audit logging
- GDPR compliance (data export/deletion)

## Monitoring & Analytics

- Activity heatmap visualization
- Verification workflow tracking
- Performance metrics dashboard
- User engagement analytics
- System health monitoring

## Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables
Key environment variables to configure:
- `JWT_SECRET` - JWT signing secret
- `MONGODB_URI` - Database connection string
- `AWS_ACCESS_KEY_ID` - S3 access key
- `OPENAI_API_KEY` - LLM API key
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with more external platforms
- [ ] Machine learning for activity recommendations
- [ ] Multi-language support
- [ ] Advanced notification system
