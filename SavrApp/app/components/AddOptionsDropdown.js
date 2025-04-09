import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const AddOptionsDropdown = ({ onCreateStore, onCreateBrand, role }) => {
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
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.addButton, 
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
          onPress={() => handleOptionSelect(onCreateStore)}
        >
          <Text style={styles.optionText}>Create a new company</Text>
        </TouchableOpacity>
        
        {
          role === 'admin' || role === 'company' ? (
            <TouchableOpacity
              style={[styles.option, { borderBottomWidth: 0, paddingBottom: 0 }]}
              onPress={() => handleOptionSelect(onCreateBrand)}
            >
              <Text style={styles.optionText}>Create a new shop</Text>
            </TouchableOpacity>
          ) : null
        }
        
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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

export default AddOptionsDropdown;