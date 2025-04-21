import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsContext } from '../contexts/SettingsContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const Search = ({ searchActive, setSearchActive, searchQuery, onSearchQueryChange }) => {
  // const route = useRoute();
  // const { searchActive, setSearchActive, searchQuery, onSearchQueryChange } = route.params || {};
  const [submitted, setSubmitted] = useState(false);
  const { darkMode } = useContext(SettingsContext);

  const handleSubmit = () => {
    if (!searchQuery.trim()) {
      console.log('Empty input');
      setSearchActive(false);
      return;
    }
    console.log(`Confirmed input: ${searchQuery}`);
    setSubmitted(true);
    setSearchActive(false);
  };

  const handleBlur = () => {
    if (!submitted) {
      console.log('Input discarded');
      setSearchActive(false);
    } else {
      // Reset submitted for next time
      setSubmitted(false);
    }
  };

  return (
    <View style={styles.header}>
      {searchActive ? (
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          autoFocus={true}
          onSubmitEditing={handleSubmit}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onEndEditing={handleBlur}

        />
      ) : (
        <TouchableOpacity onPress={() => setSearchActive(true)} style={styles.searchIconContainer}>
          {searchQuery.trim() ? (
            <Text style={{ color: darkMode ? '#fff' : '#333', fontSize: 16 }}>
              {searchQuery}
            </Text>
          ) : (
            <Ionicons name="search" size={24} color={darkMode ? '#fff' : '#333'} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  searchIconContainer: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default Search;