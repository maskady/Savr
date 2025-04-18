import React from "react";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from "./contexts/SettingsContext";
import { ShopProvider } from "./contexts/ShopContext";
import { CartProvider } from "./contexts/CheckoutContext";

export default function App() {
  // Show only the first line of console.error messages
  // This is useful for debugging, as it prevents long error messages from cluttering the console.
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string') {
      let n_lines = 10
      n_lines = Math.min(n_lines, args[0].split('\n').length)
      const firstLines = args[0].split('\n').slice(0, n_lines).join('\n'); 
      originalConsoleError(firstLines);
    } else {
      originalConsoleError(...args);
    }
  };

  return (
    <CartProvider>
      <AuthProvider>
        <SettingsProvider>
          <ShopProvider>
            <Navigation />
          </ShopProvider>
        </SettingsProvider>
      </AuthProvider>
    </CartProvider>
  );
}