import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Heatmap from './pages/student/Heatmap';
import Certificates from './pages/student/Certificates';
import Reports from './pages/student/Reports';
import Internships from './pages/student/Internships';

// Get the Clerk publishable key
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

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
            
            {/* Auth routes - redirect to dashboard if already signed in */}
            <Route 
              path="/login" 
              element={
                <>
                  <SignedOut>
                    <Login />
                  </SignedOut>
                  <SignedIn>
                    <Navigate to="/app/dashboard" replace />
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
            
            {/* Protected routes */}
            <Route 
              path="/app/dashboard" 
              element={
                <>
                  <SignedIn>
                    <StudentDashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/app/profile" 
              element={
                <>
                  <SignedIn>
                    <StudentProfile />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/app/heatmap" 
              element={
                <>
                  <SignedIn>
                    <Heatmap />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/app/certificates" 
              element={
                <>
                  <SignedIn>
                    <Certificates />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/app/reports" 
              element={
                <>
                  <SignedIn>
                    <Reports />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
            <Route 
              path="/app/internships" 
              element={
                <>
                  <SignedIn>
                    <Internships />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/login" replace />
                  </SignedOut>
                </>
              } 
            />
          </Routes>
        </div>
      </ClerkProvider>
    </Router>
  );
}

export default App;
