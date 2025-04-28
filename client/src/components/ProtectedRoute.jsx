import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const location = useLocation();
    
    useEffect(() => {
        console.log('ProtectedRoute checking path:', location.pathname);
        console.log('Token exists:', !!token);
        console.log('User role:', role);
    }, [location.pathname, token, role]);
    
    if (!token) {
        console.log('No token found, redirecting to login...');
        return <Navigate to="/login" replace />;
    }
    
    // For routes that need specific roles (optional enhancement)
    if (location.pathname.includes('/patient/') && role !== 'patient') {
        console.log('Not authorized as patient, redirecting...');
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;