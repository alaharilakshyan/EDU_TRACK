# Deployment Guide for Student Activity Platform

## Issues Fixed for Hosting

### 1. Removed Development Proxy
- Removed `"proxy": "http://localhost:5000"` from `frontend/package.json`
- This proxy only works in development and causes hosting failures

### 2. Environment Configuration
- Updated `frontend/.env.example` with production configuration
- API now uses `process.env.REACT_APP_API_URL` for flexible deployment

## Hosting Solutions

### Option 1: Netlify (Recommended for Frontend)
1. **Deploy Frontend to Netlify**
   ```bash
   cd frontend
   npm run build
   # Upload the build folder to Netlify
   ```

2. **Environment Variables in Netlify**
   - Go to Site settings > Environment variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
   - Add: `REACT_APP_CLERK_PUBLISHABLE_KEY` = your Clerk key

### Option 2: Vercel (Frontend)
1. **Deploy to Vercel**
   ```bash
   cd frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Environment Variables in Vercel**
   - Add `REACT_APP_API_URL` and `REACT_APP_CLERK_PUBLISHABLE_KEY`

### Option 3: Railway/Render (Backend + Frontend)
1. **Deploy Backend**
   - Deploy `backend` folder to Railway/Render
   - Set environment variables for database, etc.

2. **Deploy Frontend**
   - Deploy `frontend` folder separately
   - Set `REACT_APP_API_URL` to your backend URL

## Required Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
CLERK_SECRET_KEY=sk_test_your_clerk_secret
```

## Troubleshooting

### "Failed to load" Error
This error is caused by:
1. **Proxy configuration** - Fixed by removing proxy from package.json
2. **Wrong API URL** - Set correct `REACT_APP_API_URL` in hosting platform
3. **CORS issues** - Ensure backend allows your frontend domain

### CORS Configuration (Backend)
Add this to your backend server:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Build Process
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend  
cd backend
npm install
npm start
```

## Quick Fix for Current Error

1. Remove proxy (already done)
2. Set `REACT_APP_API_URL` in your hosting platform
3. Rebuild and redeploy frontend
4. Ensure backend is deployed and accessible

## Testing Before Deployment

```bash
# Test frontend build locally
cd frontend
REACT_APP_API_URL=https://your-backend-url.com/api npm run build
serve -s build -p 3000
```

This will simulate production environment locally.
