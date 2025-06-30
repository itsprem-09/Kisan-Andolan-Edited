import api from './api';

// Remove the mock service and use real auth service in all environments
const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        // Store token with expiry information from server
        const tokenData = {
          value: response.data.token,
          // Use server-provided expiry time if available, otherwise fallback to client calculation
          expiry: response.data.expiresAt || (Date.now() + (29 * 24 * 60 * 60 * 1000))
        };
        
        // Extract user object and ensure it's complete
        const user = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        };
        
        // Store both token and user data
        localStorage.setItem('tokenData', JSON.stringify(tokenData));
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.token); // Keep for backward compatibility
        
        console.log('Auth data stored successfully:', { 
          tokenExpires: new Date(tokenData.expiry).toLocaleString(),
          user
        });
        
        // Return complete response with both token and user
        return {
          token: response.data.token,
          expiresAt: tokenData.expiry,
          user
        };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenData');
    localStorage.removeItem('user');
    // Don't navigate here - let React Router handle it
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === "undefined") {
        console.log('No user data found in localStorage');
        return null;
      }
      
      const user = JSON.parse(userStr);
      
      // Validate that the user object has essential properties
      if (!user || !user._id || !user.email) {
        console.log('Invalid user data format in localStorage');
        localStorage.removeItem('user'); // Clear invalid data
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      return null;
    }
  },

  isAuthenticated() {
    const tokenData = this.getTokenData();
    const user = this.getCurrentUser();
    return !!tokenData && tokenData.expiry > Date.now() && !!user;
  },

  getTokenData() {
    try {
      const tokenDataStr = localStorage.getItem('tokenData');
      if (!tokenDataStr) {
        // Handle legacy token storage
        const legacyToken = localStorage.getItem('token');
        if (legacyToken) {
          // Convert legacy token to new format with expiry
          const tokenData = {
            value: legacyToken,
            expiry: Date.now() + (29 * 24 * 60 * 60 * 1000)
          };
          localStorage.setItem('tokenData', JSON.stringify(tokenData));
          return tokenData;
        }
        return null;
      }
      
      const tokenData = JSON.parse(tokenDataStr);
      
      // Check if token has expired
      if (tokenData.expiry < Date.now()) {
        console.log('Token has expired, clearing auth data');
        this.logout();
        return null;
      }
      
      return tokenData;
    } catch (error) {
      console.error('Error getting token data:', error);
      return null;
    }
  },

  getToken() {
    const tokenData = this.getTokenData();
    return tokenData ? tokenData.value : null;
  }
};

export default authService; 