import React from "react";
import Navigation from "./navigation/Navigation";
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from "./contexts/SettingsContext";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Navigation />
      </SettingsProvider>
    </AuthProvider>
  );
}