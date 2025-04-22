import React, { useState, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import getStyles from '../styles/SettingsStyles';
import { SettingsContext } from '../contexts/SettingsContext';

export const SettingsButton = () => {
    const { darkMode } = useContext(SettingsContext);
    const [styles] = useState(getStyles(darkMode));
    return <Ionicons name="settings-sharp" size={styles.settingsDropDown.settingsIcon.size} color={styles.settingsDropDown.settingsIcon.color} />
}