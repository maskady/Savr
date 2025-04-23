import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import getStyles from '../styles/SettingsStyles';
import SettingsContext from '../contexts/SettingsContext';

const SettingsButton = () => {
    const { darkMode } = useContext(SettingsContext);
    const [styles] = useState(getStyles(darkMode));

    useEffect(() => {
        
    }, [darkMode]);
    return <Ionicons name="settings-sharp" size={styles.settingsDropDown.settingsIcon.size} color={styles.settingsDropDown.settingsIcon.color} />
}

export default SettingsButton;