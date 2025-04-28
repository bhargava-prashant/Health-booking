// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token validity on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      const storedUserId = localStorage.getItem('userId');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set default auth header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Optional: verify token with backend
        // const response = await axios.get('http://localhost:5000/api/auth/verify');
        
        setIsAuthenticated(true);
        setUserRole(storedRole);
        setUserId(storedUserId);
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, role } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }
      
      // Decode token to extract user ID (assuming JWT contains user ID)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { id } = JSON.parse(jsonPayload);
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);
      
      // Update state
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, role };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Reset state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Context value
  const value = {
    isAuthenticated,
    userRole,
    userId,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};