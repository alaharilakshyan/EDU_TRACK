# Design Brief: Centralised Digital Platform for Comprehensive Student Activity Records in HEIs

## Overview
A comprehensive web platform that aggregates, verifies, and showcases student activities across Higher Education Institutions (HEIs). The system provides activity tracking, CV/ATS scoring, faculty verification workflows, and university-specific event management.

## Architecture
- **Frontend**: React with hooks, component-based architecture
- **Backend**: Node.js with Express, RESTful API design
- **Database**: MongoDB with Mongoose ODM
- **Storage**: Object storage (S3/MinIO) for file uploads
- **LLM Integration**: CV parsing and ATS scoring
- **Authentication**: JWT-based with role-based access control

## Core Features
1. **Student Portal**: Dashboard, profile with activity heatmap, certificate/report uploads, placement portal with CV scoring
2. **Faculty Portal**: Student management, verification workflows, university activity creation
3. **Admin Portal**: User management, university enrollment, audit logs
4. **Activity Tracking**: GitHub-style heatmap visualization of all student activities
5. **CV/ATS System**: LLM-powered resume scoring against job descriptions
6. **University Integration**: Auto-suggest and university-specific event filtering

## Key Technical Components
- 7-digit unique user IDs (uid7) for all users
- Activity event aggregation for heatmap visualization
- File upload and verification workflow
- Real-time notifications system
- External API integration for university data
- Comprehensive audit trail for all approvals

## Scalability Considerations
- Separate microservices for LLM processing
- Caching layer for university API calls
- Asynchronous file processing
- Rate limiting and input validation
- Horizontal scaling support

## Security Features
- JWT authentication with refresh tokens
- Role-based middleware
- File upload validation and virus scanning
- GDPR compliance (data export/deletion)
- Comprehensive audit logging

## User Roles & Permissions
- **Student**: Upload activities, view analytics, apply to placements
- **Faculty**: Verify submissions, manage university activities, view student analytics
- **Admin**: Full system management, user creation, university enrollment

## Success Metrics
- Student engagement through activity heatmap
- Verification turnaround time
- CV scoring accuracy and placement match rates
- University adoption and activity volume
- System uptime and performance metrics
