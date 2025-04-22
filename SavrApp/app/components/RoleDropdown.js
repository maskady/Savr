import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Appearance } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // pour une icône de flèche
import getStyles from '../styles/AppStyles';

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
  const [roles, setRoles] = useState([]);

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  
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
    <View style={[styles.roleDropdown.container, roles[0] === 'user' ? { display: 'none' } : {}]}>
      <TouchableOpacity style={styles.roleDropdown.header} onPress={toggleDropdown}>
        <Text style={styles.roleDropdown.selectedText}>
          {selectedRole || 'Sélectionner un rôle'}
        </Text>
        <MaterialIcons
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={styles.roleDropdown.icon.color}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.roleDropdown.list}>
          <FlatList
            data={roles}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.roleDropdown.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.roleDropdown.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
