import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

// Clerk wrapper for the entire app
export const ClerkAuthProvider = ({ children }) => {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};

// Protected route component
export const ClerkProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};

// Hook to get current user
export const useClerkUser = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  return {
    user,
    isSignedIn,
    isLoaded,
    getToken,
    // Map Clerk user to our app's user format
    userData: isSignedIn ? {
      uid7: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
      role: user.publicMetadata?.role || 'student',
      universityId: user.publicMetadata?.universityId,
      profileRef: user.publicMetadata?.profileRef
    } : null
  };
};

// Admin route protection
export const AdminRoute = ({ children }) => {
  const { userData, isSignedIn } = useClerkUser();
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (userData?.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return children;
};

// Faculty route protection
export const FacultyRoute = ({ children }) => {
  const { userData, isSignedIn } = useClerkUser();
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (userData?.role !== 'faculty') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return children;
};

// Student route protection
export const StudentRoute = ({ children }) => {
  const { userData, isSignedIn } = useClerkUser();
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (userData?.role !== 'student') {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  return children;
};
