import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import getStyles from '../styles/AppStyles';
import { FontAwesome6 } from '@expo/vector-icons';

const AddOptionsDropdown = ({ onCreateCompany, onCreateShop, role }) => {
  const styles = getStyles();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  
  const menuHeight = role === 'admin' || role === 'company' ? 100 : 50; 

  useEffect(() => {
    Animated.timing(dropdownHeight, {
      toValue: isOpen ? menuHeight : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (callback) => {
    if (callback) callback();
    setIsOpen(false);
  };

  return (
    <View style={styles.addOptionsDropdown.container}>
      <TouchableOpacity 
        style={[
          styles.addOptionsDropdown.addButton, 
          isOpen && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: 0,
          }
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <FontAwesome6 name="plus" color="#fff" size={24} />
      </TouchableOpacity>

      <Animated.View style={[
        styles.addOptionsDropdown.dropdownMenu,
        { 
          height: dropdownHeight, 
          opacity: dropdownHeight.interpolate({
            inputRange: [0, menuHeight],
            outputRange: [0, 1]
          }) 
        }
      ]}>
        <TouchableOpacity
          style={styles.addOptionsDropdown.option}
          onPress={() => handleOptionSelect(onCreateCompany)}
        >
          <Text style={styles.addOptionsDropdown.optionText}>Create a new company</Text>
        </TouchableOpacity>
        
        {
          role === 'admin' || role === 'company' ? (
            <TouchableOpacity
              style={[styles.addOptionsDropdown.option, { borderBottomWidth: 0, paddingBottom: 0 }]}
              onPress={() => handleOptionSelect(onCreateShop)}
            >
              <Text style={styles.addOptionsDropdown.optionText}>Create a new shop</Text>
            </TouchableOpacity>
          ) : null
        }
        
      </Animated.View>
      
      {isOpen && (
        <TouchableOpacity 
          style={styles.addOptionsDropdown.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={0}
        />
      )}
    </View>
  );
};

export default AddOptionsDropdown;