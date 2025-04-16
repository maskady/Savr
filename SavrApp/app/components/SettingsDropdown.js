import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Appearance, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/token';
import getStyles from '../styles/SettingsStyles';
import { SettingsButton } from './SettingsButton';
import { loadUserData } from '../utils/api';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const [styles, setStyles] = useState(getStyles());
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  
  const menuHeight = 100;

  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: isOpen ? menuHeight : 0,
      duration: 300,
      useNativeDriver: false
    }).start();

    // Define an async function to load user data and update state
    const fetchUserData = async () => {
      try {
        const data = await loadUserData(); // Wait for the promise to resolve
        setUser(data);
      } catch (error) {
        console.error("[SettingsDropdown] Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

  if (isLoading || user.roleId === 'user') {
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