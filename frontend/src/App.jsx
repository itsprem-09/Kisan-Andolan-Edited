import React, { useEffect } from "react";
import Routes from "./Routes";
import authService from "./services/authService";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  // Initialize auth on app startup
  useEffect(() => {
    // Check for valid stored authentication
    try {
      const tokenData = localStorage.getItem('tokenData');
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        console.log('App startup: Found token data, expires:', new Date(parsed.expiry).toLocaleString());

        // If token is expired, clear it
        if (parsed.expiry < Date.now()) {
          console.log('Token expired, clearing auth data');
          authService.logout();
        }
      }
    } catch (error) {
      console.error('Error checking authentication on startup:', error);
    }
  }, []);

  return (
    <LanguageProvider>
      <Routes />
    </LanguageProvider>
  );
}

export default App;
