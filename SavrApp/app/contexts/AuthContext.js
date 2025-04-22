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
  
  
  // Define an async function to load user data and update state
  const fetchUserData = async () => {
    try {
      const data = await loadUserData(); // Wait for the promise to resolve
      setUser(data);
      // console.log("[AuthContext] User data loaded:", data);
    } catch (error) {
      console.error("[AuthContext] Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // Check for existing token on app start
  useEffect(() => {
    checkToken();

    fetchUserData();
    
  }, [isLoggedIn]);

  const checkToken = async () => {
    try {
      const token = await getToken();
      // console.log("AuthProvider: Token", token);
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
    fetchBusinessCategories();
    setIsLoggedIn(true);
    fetchUserData();
    console.log("AuthProvider: User logged in");
  };

  const logout = () => {
    setIsLoggedIn(false);
    removeToken();
    setUser({});
    console.log("AuthProvider: User logged out");
  };

  return (

    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout, user, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};