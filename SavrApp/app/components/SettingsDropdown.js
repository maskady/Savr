import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/token';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  
  const menuHeight = 100;

  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: isOpen ? menuHeight : 0,
      duration: 300,
      useNativeDriver: false
    }).start();

    const loadUserData = async () => {
      try {
        const response = await fetch("https://www.sevr.polaris.marek-mraz.com/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        const dataResponse = await response.json();
        const data = dataResponse.data;

        if (!response.ok) {
          console.log("Response not ok:", response.status, response.statusText);
          throw new Error("Failed to fetch user data");
        }

        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigation.navigate("Error", { error: "Failed to load user data" });
      }
    };

    loadUserData();
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

  if (isLoading) {
    return (
      <TouchableOpacity style={styles.settingsButton} onPress={() => {navigation.navigate('Settings')}}>
        <Ionicons name="settings-sharp" size={24} color="#000" />
      </TouchableOpacity>
    )
  }

  if (user.roleId === 'user') {
    return (
      <TouchableOpacity style={styles.settingsButton} onPress={() => {navigation.navigate('Settings')}}>
        <Ionicons name="settings-sharp" size={24} color="#000" />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.gearButton, 
          isOpen && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: 0,
          }
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <Ionicons name="settings-sharp" size={24} color="#000" />
      </TouchableOpacity>

      <Animated.View style={[
        styles.dropdownMenu,
        { 
          height: dropdownHeight, 
          opacity: dropdownHeight.interpolate({
            inputRange: [0, menuHeight],
            outputRange: [0, 1]
          }) 
        }
      ]}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleOptionSelect(() => navigation.navigate('Settings'))}
        >
          <Text style={styles.optionText}>User Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
            style={[styles.option, { borderBottomWidth: 0, paddingBottom: 0 }]}
            onPress={() => handleOptionSelect(() => handleAlert('Company Settings'))}
        >
            <Text style={styles.optionText}>Company Settings</Text>
        </TouchableOpacity>
        
      </Animated.View>
      
      {isOpen && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
    width: 40, 
    paddingLeft: 15,
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  plusIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    right: -15,
    width: 200, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 45,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999,
  },
});

export default SettingsDropdown;