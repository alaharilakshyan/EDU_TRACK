import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/auth/Login';
import StudentLogin from './pages/auth/StudentLogin';
import FacultyLogin from './pages/auth/FacultyLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Heatmap from './pages/student/Heatmap';
import Certificates from './pages/student/Certificates';
import Reports from './pages/student/Reports';
import Internships from './pages/student/Internships';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Get the Clerk publishable key
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Authorized faculty emails (you can update this list)
const AUTHORIZED_FACULTY = [
  'faculty@university.edu',
  'professor@university.edu',
  'dean@university.edu'
  // Add more authorized faculty emails here
];

// Authorized admin emails
const AUTHORIZED_ADMINS = [
  'admin@university.edu',
  'it.support@university.edu'
  // Add more authorized admin emails here
];

// Role-based access control component
const RoleProtectedRoute = ({ children, allowedRoles, fallbackPath = '/' }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login/student" replace />;
  }
  
  const userEmail = user.primaryEmailAddress?.emailAddress;
  
  // Check if user is authorized for the requested role
  const isAuthorized = allowedRoles.some(role => {
    if (role === 'faculty') {
      return AUTHORIZED_FACULTY.includes(userEmail);
    }
    if (role === 'admin') {
      return AUTHORIZED_ADMINS.includes(userEmail);
    }
    if (role === 'student') {
      return !AUTHORIZED_FACULTY.includes(userEmail) && !AUTHORIZED_ADMINS.includes(userEmail);
    }
    return false;
  });
  
  if (!isAuthorized) {
    // Redirect unauthorized users to appropriate login
    if (AUTHORIZED_FACULTY.includes(userEmail)) {
      return <Navigate to="/login/faculty" replace />;
    }
    if (AUTHORIZED_ADMINS.includes(userEmail)) {
      return <Navigate to="/login/admin" replace />;
    }
    return <Navigate to="/login/student" replace />;
  }
  
  return children;
};

function App() {
  // If no Clerk key is available, show a simple fallback
  if (!clerkPublishableKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Setup Required</h1>
          <p className="text-gray-600">Please set up your Clerk authentication keys to continue.</p>
          <p className="text-sm text-gray-500 mt-2">Check your .env file for REACT_APP_CLERK_PUBLISHABLE_KEY</p>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Auth routes - redirect to dashboard if already signed in */}
            <Route path="/login" element={<Login />} />
            <Route 
              path="/login/student" 
              element={
                <>
                  <SignedOut>
                    <StudentLogin />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/app/dashboard" replace />
                  </SignedIn>
                </>
              } 
            />
            <Route 
              path="/login/faculty" 
              element={
                <>
                  <SignedOut>
                    <FacultyLogin />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/faculty/dashboard" replace />
                  </SignedIn>
                </>
              } 
            />
            <Route 
              path="/login/admin" 
              element={
                <>
                  <SignedOut>
                    <AdminLogin />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/admin/dashboard" replace />
                  </SignedIn>
                </>
              } 
            />
            <Route 
              path="/register" 
              element={
                <>
                  <SignedOut>
                    <Register />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/app/dashboard" replace />
                  </SignedIn>
                </>
              } 
            />
            
            {/* Protected Student Routes */}
            <Route 
              path="/app/dashboard" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/app/profile" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/app/heatmap" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <Heatmap />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/app/certificates" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <Certificates />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/app/reports" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <Reports />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/app/internships" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <Internships />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Protected Faculty Routes */}
            <Route 
              path="/faculty/dashboard" 
              element={
                <RoleProtectedRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </ClerkProvider>
    </Router>
  );
}

export default App;
