import React, { useState, useContext, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import getStyles from '../styles/SettingsStyles';
import { Appearance } from 'react-native';
import { SettingsContext } from '../contexts/SettingsContext';

export const SettingsButton = () => {
    const { darkMode } = useContext(SettingsContext);
    const [styles] = useState(getStyles(darkMode));
    return <Ionicons name="settings-sharp" size={styles.settingsDropDown.settingsIcon.size} color={styles.settingsDropDown.settingsIcon.color} />
}