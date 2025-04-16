import React, {useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import getStyles from '../styles/SettingsStyles';

export const SettingsButton = () => {
    const [styles, setStyles] = useState(getStyles());

    return <Ionicons name="settings-sharp" size={styles.settingsDropDown.settingsIcon.size} color={styles.settingsDropDown.settingsIcon.color} />
}