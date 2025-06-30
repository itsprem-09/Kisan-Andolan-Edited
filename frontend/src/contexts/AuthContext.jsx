import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  // Use useCallback to prevent unnecessary re-renders
  const checkAuth = useCallback(() => {
    try {
      console.log('Checking authentication state...');
      const user = authService.getCurrentUser();
      const hasToken = authService.getToken();
      const isValid = authService.isAuthenticated();
      
      console.log('Auth check:', { 
        hasUser: !!user, 
        hasToken: !!hasToken, 
        isValid: !!isValid,
        userData: user ? `User ID: ${user._id}, Role: ${user.role}` : 'No user data'
      });
      
      // If we have a token but no user data, clear the token as it's corrupt
      if (hasToken && !user) {
        console.warn('Found token but no user data - clearing auth state');
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else if (isValid && user) {
        console.log('Valid authentication found, user is authenticated');
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        console.log('No valid authentication found');
        // Clean up any invalid auth data
        if (hasToken && !isValid) {
          console.log('Token exists but is invalid, clearing auth state');
          authService.logout();
        }
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear localStorage on auth errors
      authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      setAuthCheckCompleted(true);
    }
  }, []);

  // Initial authentication check on mount
  useEffect(() => {
    // Initialize with stored values immediately to avoid flicker
    const initialUser = authService.getCurrentUser();
    const initialIsAuthenticated = authService.isAuthenticated();
    
    if (initialIsAuthenticated && initialUser) {
      setCurrentUser(initialUser);
      setIsAuthenticated(true);
    }
    
    // Then perform a thorough check
    checkAuth();
    
    // Set up event listener for storage events to handle login/logout across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user' || e.key === 'tokenData') {
        console.log('Storage changed for auth data, rechecking auth state');
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to periodically check auth status (every minute)
    const authCheckInterval = setInterval(() => {
      console.log('Periodic auth check');
      checkAuth();
    }, 60000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      console.log('Login successful, setting auth state with user:', response.user);
      
      if (response && response.user) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
      } else {
        console.error('Login succeeded but user data is missing');
        throw new Error('Login response missing user data');
      }
      
      return response;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out');
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    authCheckCompleted,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 