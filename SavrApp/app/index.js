import React from "react";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </AuthProvider>
  );
}