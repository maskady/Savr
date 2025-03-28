import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ isDarkMode, placeholder = "Oulu" }) => {
  return (
    <View style={styles.header}>
      <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
        <Ionicons
          name="search"
          size={20}
          color={isDarkMode ? '#ccc' : '#888'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#888' : '#666'}
          style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
});

export default Header;