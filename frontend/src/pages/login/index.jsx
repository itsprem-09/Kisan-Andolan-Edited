import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Icon from 'components/AppIcon';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: 'admin@example.com', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, checkAuth } = useAuth();

  // Get the page the user was trying to visit before being redirected
  const from = location.state?.from || '/admin-dashboard';

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        // Check if token exists in localStorage
        const tokenData = localStorage.getItem('tokenData');
        const userData = localStorage.getItem('user');
        
        if (tokenData && userData) {
          const parsedToken = JSON.parse(tokenData);
          // If token is valid and not expired
          if (parsedToken.expiry > Date.now()) {
            console.log('Valid token and user data found on login page, redirecting to:', from);
            navigate(from, { replace: true });
            return;
          }
        }
        
        // Force a fresh auth check
        checkAuth();
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkIfAlreadyLoggedIn();
  }, [navigate, from, checkAuth]);

  // Watch for authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Authentication detected, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with credentials:', credentials.email);
      const result = await login(credentials);
      
      if (!result || !result.user) {
        throw new Error('Login response missing user data');
      }
      
      console.log('Login successful, user authenticated:', result.user);
      
      // Verify user data was stored
      const storedUser = localStorage.getItem('user');
      const tokenData = localStorage.getItem('tokenData');
      
      if (!storedUser || !tokenData) {
        console.error('Authentication data not properly stored');
        throw new Error('Authentication data storage failed');
      }
      
      // No need for explicit navigation as the useEffect will handle it
      // when isAuthenticated becomes true
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed: ' + (err.message || 'Invalid email or password. Please try again.'));
      
      // Clear any partial auth data that might be corrupted
      localStorage.removeItem('token');
      localStorage.removeItem('tokenData');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your credentials to access the admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
              <Icon name="AlertCircle" size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 