import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [currency, setCurrency] = useState({ symbol: '€', code: 'EUR' });
    const [language, setLanguage] = useState('en'); 
    const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');

    // Listen for system theme changes -> when we have settings for setting dark mode, this needs to be taken care of - e.g. listen only, if set to "system"
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setDarkMode(colorScheme === 'dark');
        });
        return () => subscription.remove();
        }, []
    );

    return (
        <SettingsContext.Provider value={{ currency, setCurrency, language, setLanguage, darkMode, setDarkMode }}>
            {children}
        </SettingsContext.Provider>
    );
};