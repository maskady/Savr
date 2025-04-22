import React, {useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import getStyles from '../styles/SettingsStyles';
import { Appearance } from 'react-native';

export const SettingsButton = () => {
    const [styles, setStyles] = useState(getStyles());
    useEffect(() => {
      const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
      return () => sub.remove();
    }, []);
    
  
    return <Ionicons name="settings-sharp" size={styles.settingsDropDown.settingsIcon.size} color={styles.settingsDropDown.settingsIcon.color} />
}