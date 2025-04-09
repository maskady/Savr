import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Appearance } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // pour une icône de flèche
import getStyles from '../styles/SettingsStyles';

const whichRoles = (highestRole) => {
  if (highestRole === 'admin') {
    return ['admin', 'company', 'shop', 'user'];
  } else if (highestRole === 'company') {
    return ['company', 'shop', 'user'];
  }
  else if (highestRole === 'shop') {
    return ['shop', 'user'];
  } else {
    return ['user'];
  }
}

export default function RoleDropdown({ selectedRole, onSelectRole, highestRole }) {
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
      const fetchedRoles = whichRoles(highestRole); 
      setRoles(fetchedRoles);
    };
  
    loadRoles();

    const subscription = Appearance.addChangeListener(handleThemeChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={[styles.dropdownContainer, roles[0] === 'user' ? { display: 'none' } : {}]}>
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
