import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading, authCheckCompleted, checkAuth } = useAuth();
  const location = useLocation();

  // Force an auth check when the route component mounts
  useEffect(() => {
    checkAuth();
    console.log('PrivateRoute mounted, auth state:', { isAuthenticated, loading });
  }, [checkAuth, isAuthenticated, loading]);

  // Debug log for troubleshooting
  console.log('PrivateRoute render state:', { 
    isAuthenticated, 
    loading, 
    authCheckCompleted,
    path: location.pathname 
  });

  // Show loading state while checking authentication
  if (loading && !authCheckCompleted) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  // Double-check token validity and user data from localStorage directly
  // This is an extra safeguard to ensure we're not using stale React state
  let hasValidAuth = false;
  
  try {
    const tokenData = localStorage.getItem('tokenData');
    const userData = localStorage.getItem('user');
    
    if (tokenData && userData) {
      const parsedToken = JSON.parse(tokenData);
      const parsedUser = JSON.parse(userData);
      
      // Check if token is valid and user data exists
      hasValidAuth = parsedToken.expiry > Date.now() && 
        parsedUser && 
        parsedUser._id && 
        parsedUser.email;
      
      console.log('Direct localStorage auth check:', { 
        hasValidToken: parsedToken.expiry > Date.now(),
        hasValidUser: !!(parsedUser && parsedUser._id)
      });
    }
  } catch (error) {
    console.error('Error checking auth from localStorage:', error);
  }

  // If authenticated either through context state or direct localStorage check
  if (isAuthenticated || hasValidAuth) {
    console.log('User is authenticated, rendering protected route');
    return <Outlet />;
  }
  
  // If not authenticated, redirect to login with the current location as the return URL
  console.log('Not authenticated, redirecting to login');
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute; 