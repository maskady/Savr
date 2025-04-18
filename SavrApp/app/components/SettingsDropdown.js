import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Appearance, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/token';
import getStyles from '../styles/SettingsStyles';
import { SettingsButton } from './SettingsButton';
import { loadUserData } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [styles, setStyles] = useState(getStyles());
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  
  const { user } = useContext(AuthContext);

  const menuHeight = 100;

  const navigation = useNavigation();

  const { fetchUserData, user } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: isOpen ? menuHeight : 0,
      duration: 300,
      useNativeDriver: false
    }).start();

    fetchUserData();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles(colorScheme));
    });

    subscription.remove();
    setIsLoading(false);
  }, [isOpen]);

  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (callback) => {
    if (callback) callback();
    setIsOpen(false);
  };

  const handleAlert = (message) => {
    alert(message);
  }

  if (isLoading || user?.roleId === 'user') {
    return (
      <TouchableOpacity style={styles.settingsDropDown.settingsButton} onPress={() => {navigation.navigate('Settings')}}>
        <SettingsButton />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.settingsDropDown.container}>
      <TouchableOpacity 
        style={[
          styles.settingsDropDown.gearButton, 
          isOpen && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: 0,
          }
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >

        <SettingsButton />

      </TouchableOpacity>

      <Animated.View style={[
        styles.settingsDropDown.dropdownMenu,
        { 
          height: dropdownHeight, 
          opacity: dropdownHeight.interpolate({
            inputRange: [0, menuHeight],
            outputRange: [0, 1]
          }) 
        }
      ]}>
        <TouchableOpacity
          style={styles.settingsDropDown.option}
          onPress={() => handleOptionSelect(() => navigation.navigate('Settings'))}
        >
          <Text style={styles.settingsDropDown.optionText}>User Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
            style={[styles.settingsDropDown.option, { borderBottomWidth: 0, paddingBottom: 0 }]}
            onPress={() => handleOptionSelect(() => navigation.navigate('CompanyList'))}
        >
            <Text style={styles.settingsDropDown.optionText}>Company Settings</Text>
        </TouchableOpacity>
        
      </Animated.View>
      
      {isOpen && (
        <TouchableOpacity 
          style={styles.settingsDropDown.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={0}
        />
      )}
    </View>
  );
};

export default SettingsDropdown;