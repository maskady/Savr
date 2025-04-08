import React, { createContext, useState } from 'react';
import { removeToken } from '../utils/token';
// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Optional helper functions
  const login = () => {
    console.log("AuthProvider: User logged in");
    setIsLoggedIn(true)
  };

  const logout = () => {
    setIsLoggedIn(false);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};