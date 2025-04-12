import React from "react";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from "./contexts/SettingsContext";
import { ShopProvider } from "./contexts/ShopContext";

export default function App() {
  // Show only the first line of console.error messages
  // This is useful for debugging, as it prevents long error messages from cluttering the console.
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string') {
      const n_lines = 10
      const firstLines = args[0].split('\n').slice(0, n_lines).join('\n'); // Get only the first n lines
      originalConsoleError(firstLines);
    } else {
      originalConsoleError(...args);
    }
  };

  return (
    <AuthProvider>
      <SettingsProvider>
        <ShopProvider>
          <Navigation />
        </ShopProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}