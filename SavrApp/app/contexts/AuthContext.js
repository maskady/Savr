import React, { createContext, useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/token';
// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await getToken();
      console.log("AuthProvider: Token", token);
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("AuthProvider: Error checking token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional helper functions
  const login = () => {
    console.log("AuthProvider: User logged in");
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};