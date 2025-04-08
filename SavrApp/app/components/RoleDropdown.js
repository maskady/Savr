import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Appearance } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // pour une icône de flèche
import getStyles from '../styles/SettingsStyles';

const fetchRoles = async () => {
  // Simulate an API call to fetch roles
  // const response = await fetch("", {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return data.roles;
  return ['admin', 'manager', 'shop owner', 'customer'];
}

export default function RoleDropdown({ selectedRole, onSelectRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [styles, setStyles] = useState(getStyles());
  const [roles, setRoles] = useState([]);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (role) => {
    onSelectRole(role);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      console.log("Theme changed:", colorScheme);
      if (colorScheme) {
        setStyles(getStyles()); 
      }
    };

    const loadRoles = async () => {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    };
  
    loadRoles();

    const subscription = Appearance.addChangeListener(handleThemeChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>
          {selectedRole || 'Sélectionner un rôle'}
        </Text>
        <MaterialIcons
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={styles.isDarkMode ? '#fff' : '#000'}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          <FlatList
            data={roles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
