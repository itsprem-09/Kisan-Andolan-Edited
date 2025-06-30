import axios from 'axios';

// const API_URL = 'https://api.rashtriyakisanmanch.com';
const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: add withCredentials to ensure cookies are sent with requests
  withCredentials: true
});

// Global state to track if we're already redirecting to avoid loops
let isRedirecting = false;

// Interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token data directly
    let token = null;
    try {
      const tokenDataStr = localStorage.getItem('tokenData');
      if (tokenDataStr) {
        const tokenData = JSON.parse(tokenDataStr);
        // Check if token has expired on the client side
        if (tokenData.expiry > Date.now()) {
          token = tokenData.value;
        } else {
          console.log('Token expired, clearing authentication data');
          localStorage.removeItem('token');
          localStorage.removeItem('tokenData');
          localStorage.removeItem('user');
          
          // If not already redirecting, redirect to login
          if (!isRedirecting && !window.location.pathname.includes('/login')) {
            isRedirecting = true;
            console.log('Token expired, redirecting to login');
            setTimeout(() => {
              window.location.href = '/login';
              isRedirecting = false;
            }, 0);
          }
          
          // Return config without token, let request fail
        }
      } else {
        // Fallback to legacy token storage
        token = localStorage.getItem('token');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      token = localStorage.getItem('token'); // Fallback
    }
    
    // Debug logging (limited info for security)
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      hasToken: !!token,
      hasFormData: config.data instanceof FormData
    });
    
    // Don't send malformed tokens (like mock tokens)
    if (token && token.startsWith('mock-jwt-token-')) {
      console.error('Invalid token format detected. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenData');
      localStorage.removeItem('user');
      
      // If not already redirecting, redirect to login
      if (!isRedirecting && !window.location.pathname.includes('/login')) {
        isRedirecting = true;
        window.location.href = '/login';
        setTimeout(() => {
          isRedirecting = false;
        }, 500);
      }
      
      return Promise.reject(new Error('Invalid token format'));
    }
    
    // Add valid token to header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For file uploads, we need to set the Content-Type to multipart/form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Handle requests to external rocket.new domains
    if (config.url && config.url.includes('builtwithrocket.new')) {
      // For log-error endpoint, use our own proxy endpoint
      if (config.url.includes('/log-error')) {
        console.log('Redirecting log-error request to local server proxy');
        config.url = config.url.replace('https://kisanando6056back.builtwithrocket.new/log-error', '/log-error');
        return config;
      } else {
        console.warn('Skipping request to external Rocket domain to avoid CORS issues');
        return Promise.reject(new Error('Request blocked to prevent CORS issues'));
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle auth errors
    if (error.response?.status === 401) {
      console.log('Authentication error (401):', originalRequest.url);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenData');
      localStorage.removeItem('user');
      
      // Avoid redirect loops and multiple redirects
      if (!isRedirecting && !window.location.pathname.includes('/login')) {
        isRedirecting = true;
        console.log('Redirecting to login page due to authentication failure');
        
        setTimeout(() => {
          window.location.href = '/login';
          isRedirecting = false;
        }, 0);
      }
    }
    
    // Handle errors from rocket.new domains
    if (originalRequest?.url?.includes('builtwithrocket.new')) {
      if (originalRequest.url.includes('/log-error')) {
        console.log('Error logging handled by proxy');
        // Already redirected to our proxy, so let the error propagate
        return Promise.reject(error);
      } else {
        console.log('Ignoring expected CORS error from Rocket domain');
        return Promise.resolve({ data: { status: 'ok' } }); 
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
