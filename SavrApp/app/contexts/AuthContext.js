import React, { createContext, useState, useEffect } from 'react';
import { removeToken, getToken } from '../utils/token';
import { fetchBusinessCategories } from '../constants/businessCategories';
import { loadUserData } from '../utils/api';
// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing token on app start
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await getToken();
      console.log("AuthProvider: Token", token);
      if (token) {
        login();
      }
    } catch (error) {
      console.error("AuthProvider: Error checking token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optional helper functions
  // Useless until we can't find a solution for the navigation issue
  const login = () => {
    console.log("AuthProvider: User logged in");
    fetchBusinessCategories();
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    removeToken();
  };

  const fetchUserData = async () => {
    const data = await loadUserData();
    setUser(data);
    console.log("AuthProvider: User data fetched", user);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, user, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};