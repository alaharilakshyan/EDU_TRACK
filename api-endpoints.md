# REST API Endpoints Specification

## Authentication Endpoints

### POST /api/auth/register
Register new user (student/faculty)
**Request:**
```json
{
  "email": "user@university.edu",
  "password": "password123",
  "role": "student",
  "universityId": "507f1f77bcf86cd799439011",
  "profileData": {
    "fullName": "John Doe",
    "rollNo": "CS2021001",
    "year": 3,
    "department": "Computer Science"
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid7": "1234567",
      "email": "user@university.edu",
      "role": "student",
      "universityId": "507f1f77bcf86cd799439011"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

### POST /api/auth/login
User login
**Request:**
```json
{
  "email": "user@university.edu",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid7": "1234567",
      "email": "user@university.edu",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

### POST /api/auth/refresh
Refresh access token
**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

## User & Profile Endpoints

### GET /api/users/:uid7
Get user basic information
**Response:**
```json
{
  "success": true,
  "data": {
    "uid7": "1234567",
    "email": "user@university.edu",
    "role": "student",
    "universityId": "507f1f77bcf86cd799439011",
    "lastLogin": "2025-01-15T10:30:00Z",
    "isActive": true
  },
  "error": null
}
```

### GET /api/students/:uid7/profile
Get full student profile
**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "rollNo": "CS2021001",
    "year": 3,
    "department": "Computer Science",
    "about": "Passionate about full-stack development",
    "linkedAccounts": {
      "github": "https://github.com/johndoe",
      "leetcode": "https://leetcode.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "activityCounts": {
      "totalActivities": 15,
      "certificates": 5,
      "reports": 3,
      "internships": 2
    },
    "analytics": {
      "gpa": 8.5,
      "verificationRatio": 0.8,
      "totalScore": 750,
      "badges": ["Active Contributor", "Verified Profile"]
    }
  },
  "error": null
}
```

### PUT /api/students/:uid7/profile
Update student profile
**Request:**
```json
{
  "fullName": "John Doe",
  "about": "Updated bio",
  "linkedAccounts": {
    "github": "https://github.com/johndoe",
    "leetcode": "https://leetcode.com/johndoe"
  }
}
```

## Activity & Heatmap Endpoints

### POST /api/activity
Create activity event
**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "date": "2025-01-15T10:30:00Z",
  "type": "certificate-uploaded",
  "typeMeta": {
    "certificateId": "507f1f77bcf86cd799439012",
    "title": "AWS Certified Developer"
  },
  "source": "manual"
}
```

### GET /api/activity/:uid7/heatmap
Get activity heatmap data
**Query Parameters:** `from=yyyy-mm-dd&to=yyyy-mm-dd`
**Response:**
```json
{
  "success": true,
  "data": {
    "dailyCounts": {
      "2025-01-01": 2,
      "2025-01-02": 0,
      "2025-01-03": 5,
      "2025-01-04": 1,
      "2025-01-05": 3
    },
    "totalEvents": 11,
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-05"
    }
  },
  "error": null
}
```

## File Upload Endpoints

### POST /api/students/:uid7/upload/certificate
Upload certificate
**Request:** (multipart/form-data)
```
file: [certificate.pdf]
title: "AWS Certified Developer"
issuer: "Amazon Web Services"
issueDate: "2024-12-01"
description: "Associate level certification"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "507f1f77bcf86cd799439013",
    "fileUrl": "https://s3.amazonaws.com/bucket/certificates/507f1f77bcf86cd799439013.pdf",
    "fileName": "aws-cert.pdf",
    "fileSize": 1024000,
    "verificationStatus": "pending",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "error": null
}
```

### POST /api/students/:uid7/upload/report
Upload report
**Request:** (multipart/form-data)
```
file: [internship-report.pdf]
title: "Summer Internship Report"
type: "internship"
description: "Report on software development internship"
```

### POST /api/students/:uid7/upload/internship
Upload internship details
**Request:**
```json
{
  "company": "TechCorp",
  "role": "Software Developer Intern",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "description": "Full-stack development internship",
  "isSummerInternship": true,
  "file": [internship-certificate.pdf]
}
```

## CV & ATS Endpoints

### POST /api/students/:uid7/cv
Upload CV file
**Request:** (multipart/form-data)
```
file: [resume.pdf]
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cvVersionId": "507f1f77bcf86cd799439014",
    "version": 1,
    "fileUrl": "https://s3.amazonaws.com/bucket/cv/507f1f77bcf86cd799439014.pdf",
    "fileName": "resume.pdf",
    "fileSize": 512000,
    "parsedContent": "John Doe\nSoftware Developer\n...",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "error": null
}
```

### POST /api/students/:uid7/cv/score
Trigger LLM CV scoring
**Request:**
```json
{
  "jobDescription": {
    "title": "Full Stack Developer",
    "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "preferredSkills": ["AWS", "Python"],
    "minExperienceYears": 1,
    "degreeRequirement": "Bachelor",
    "industry": "Technology",
    "company": "TechCorp"
  }
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cvVersionId": "507f1f77bcf86cd799439014",
    "finalATSPercent": 85.2,
    "scores": {
      "skillMatch": 0.9,
      "experience": 0.8,
      "education": 1.0,
      "activity": 0.7,
      "certification": 0.6,
      "verification": 0.8
    },
    "topReasons": [
      "Strong match on required skills",
      "Relevant internship experience",
      "Good educational background"
    ],
    "missing": [
      "No AWS certification",
      "Limited leadership experience"
    ],
    "recommendations": [
      "Get AWS certification",
      "Add more project details"
    ]
  },
  "error": null
}
```

### GET /api/students/:uid7/cv/versions
List CV versions
**Response:**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "cvVersionId": "507f1f77bcf86cd799439014",
        "version": 2,
        "fileName": "resume-v2.pdf",
        "atsScore": 85.2,
        "isActive": true,
        "createdAt": "2025-01-15T10:30:00Z"
      },
      {
        "cvVersionId": "507f1f77bcf86cd799439013",
        "version": 1,
        "fileName": "resume.pdf",
        "atsScore": 78.5,
        "isActive": false,
        "createdAt": "2025-01-10T15:20:00Z"
      }
    ]
  },
  "error": null
}
```

## Faculty Endpoints

### GET /api/faculty/:uid7/students
List students in faculty's university
**Query Parameters:** `page=1&limit=20&department=Computer Science&year=3&search=john`
**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "uid7": "1234567",
        "fullName": "John Doe",
        "rollNo": "CS2021001",
        "year": 3,
        "department": "Computer Science",
        "activityCounts": {
          "totalActivities": 15,
          "certificates": 5,
          "reports": 3,
          "internships": 2
        },
        "analytics": {
          "verificationRatio": 0.8,
          "totalScore": 750
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "error": null
}
```

### POST /api/faculty/:uid7/approve/:itemId
Approve certificate/report/internship
**Request:**
```json
{
  "comments": "Verified with university records",
  "itemType": "certificate"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "itemId": "507f1f77bcf86cd799439013",
    "verificationStatus": "verified",
    "verifiedBy": "7654321",
    "verificationDate": "2025-01-15T10:30:00Z",
    "verificationComments": "Verified with university records"
  },
  "error": null
}
```

### POST /api/faculty/:uid7/reject/:itemId
Reject certificate/report/internship
**Request:**
```json
{
  "comments": "Document appears to be falsified",
  "itemType": "certificate"
}
```

### POST /api/faculty/:uid7/events
Create university event
**Request:**
```json
{
  "title": "Hackathon 2025",
  "description": "Annual university hackathon",
  "type": "hackathon",
  "startDate": "2025-03-15T09:00:00Z",
  "endDate": "2025-03-16T18:00:00Z",
  "location": "Main Auditorium",
  "isVirtual": false,
  "registrationLink": "https://forms.university.edu/hackathon2025",
  "eligibilityCriteria": "Open to all Computer Science students",
  "maxParticipants": 100
}
```

## University & Events Endpoints

### GET /api/universities
Search universities via external API
**Query Parameters:** `query=massachusetts&country=united states`
**Response:**
```json
{
  "success": true,
  "data": {
    "universities": [
      {
        "name": "Massachusetts Institute of Technology",
        "country": "United States",
        "domain": "mit.edu",
        "apiId": "mit.edu"
      },
      {
        "name": "University of Massachusetts",
        "country": "United States", 
        "domain": "umass.edu",
        "apiId": "umass.edu"
      }
    ]
  },
  "error": null
}
```

### GET /api/events
Fetch events feed
**Query Parameters:** `universityId=507f1f77bcf86cd799439011&type=hackathon&upcoming=true&page=1&limit=10`
**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "eventId": "507f1f77bcf86cd799439015",
        "title": "Hackathon 2025",
        "description": "Annual university hackathon",
        "type": "hackathon",
        "universityId": "507f1f77bcf86cd799439011",
        "startDate": "2025-03-15T09:00:00Z",
        "endDate": "2025-03-16T18:00:00Z",
        "location": "Main Auditorium",
        "isVirtual": false,
        "registrationLink": "https://forms.university.edu/hackathon2025",
        "currentParticipants": 45,
        "maxParticipants": 100,
        "organizer": "Computer Science Department"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "error": null
}
```

## Admin Endpoints

### GET /api/admin/users
List and manage users
**Query Parameters:** `role=student&universityId=507f1f77bcf86cd799439011&page=1&limit=20&search=john`
**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "uid7": "1234567",
        "email": "user@university.edu",
        "role": "student",
        "universityId": "507f1f77bcf86cd799439011",
        "isActive": true,
        "lastLogin": "2025-01-15T10:30:00Z",
        "createdAt": "2024-09-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  },
  "error": null
}
```

### POST /api/admin/create-user
Create new user
**Request:**
```json
{
  "email": "newuser@university.edu",
  "role": "faculty",
  "universityId": "507f1f77bcf86cd799439011",
  "profileData": {
    "fullName": "Jane Smith",
    "employeeId": "FAC2023001",
    "department": "Computer Science",
    "designation": "Assistant Professor"
  },
  "sendWelcomeEmail": true
}
```

### POST /api/admin/assign-role
Change user role
**Request:**
```json
{
  "uid7": "1234567",
  "newRole": "faculty",
  "reason": "Promoted to faculty position"
}
```

### GET /api/admin/audit-logs
Get audit logs
**Query Parameters:** `userId=1234567&action=approve&from=2025-01-01&to=2025-01-31&page=1&limit=50`
**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "auditLogId": "507f1f77bcf86cd799439016",
        "userId": "7654321",
        "action": "approve",
        "resourceType": "certificate",
        "resourceId": "507f1f77bcf86cd799439013",
        "oldValues": { "verificationStatus": "pending" },
        "newValues": { "verificationStatus": "verified" },
        "reason": "Verified with university records",
        "ipAddress": "192.168.1.100",
        "timestamp": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "pages": 25
    }
  },
  "error": null
}
```

## Notification Endpoints

### GET /api/notifications/:uid7
Get user notifications
**Query Parameters:** `unread=true&category=verification&page=1&limit=20`
**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notificationId": "507f1f77bcf86cd799439017",
        "title": "Certificate Verified",
        "message": "Your AWS certificate has been verified by faculty.",
        "type": "success",
        "category": "verification",
        "isRead": false,
        "actionUrl": "/certificates/507f1f77bcf86cd799439013",
        "actionText": "View Certificate",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "error": null
}
```

### POST /api/notifications/send
Send notification (server-side)
**Request:**
```json
{
  "userIds": ["1234567", "2345678"],
  "title": "New Hackathon Announced",
  "message": "Annual hackathon 2025 is now open for registration.",
  "type": "info",
  "category": "event",
  "actionUrl": "/events/507f1f77bcf86cd799439015",
  "actionText": "Register Now"
}
```

### PUT /api/notifications/:notificationId/read
Mark notification as read
**Response:**
```json
{
  "success": true,
  "data": {
    "notificationId": "507f1f77bcf86cd799439017",
    "isRead": true,
    "readAt": "2025-01-15T11:00:00Z"
  },
  "error": null
}
```

## Blog Endpoints

### GET /api/blog/posts
Get blog posts
**Query Parameters:** `universityId=507f1f77bcf86cd799439011&tag=hackathon&page=1&limit=10`
**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "postId": "507f1f77bcf86cd799439018",
        "title": "Tips for Hackathon Success",
        "content": "Participating in hackathons can be a great way...",
        "author": {
          "name": "Jane Smith",
          "uid7": "7654321"
        },
        "universityId": "507f1f77bcf86cd799439011",
        "tags": ["hackathon", "tips", "programming"],
        "isGlobal": false,
        "viewCount": 125,
        "createdAt": "2025-01-10T14:30:00Z",
        "updatedAt": "2025-01-10T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "error": null
}
```

### POST /api/blog/posts
Create blog post (faculty/admin only)
**Request:**
```json
{
  "title": "New Blog Post",
  "content": "Blog content here...",
  "tags": ["technology", "education"],
  "isGlobal": false,
  "universityId": "507f1f77bcf86cd799439011"
}
```

## Standard Error Response Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Email is required"
    }
  }
}
```

## Rate Limits
- Auth endpoints: 5 requests per minute
- File upload: 10 requests per minute
- LLM scoring: 3 requests per minute
- Other endpoints: 100 requests per minute

## File Upload Limits
- Max file size: 10MB
- Allowed types: PDF, DOC, DOCX, JPG, PNG
- Virus scanning enabled in production
