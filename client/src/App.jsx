import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    // They're logged in but don't have the right role
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route - redirects if already authenticated
const PublicRoute = ({ children, redirectPath }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Only redirect if authentication is complete and user is authenticated
  if (isAuthenticated && !loading) {
    // Determine redirect based on role
    if (redirectPath === 'auto') {
      let targetPath;
      switch (userRole) {
        case 'admin':
          targetPath = '/admin/dashboard';
          break;
        case 'doctor':
          targetPath = '/doctor/dashboard';
          break;
        case 'patient':
          targetPath = '/patient/dashboard';
          break;
        default:
          targetPath = '/';
      }
      return <Navigate to={targetPath} replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute redirectPath="auto">
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute redirectPath="auto">
            <RegisterPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />

        {/* Doctor Dashboard Route - Fixed the role requirement */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;