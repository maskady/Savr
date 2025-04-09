import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Search = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!searchQuery.trim()) {
      console.log('Empty input');
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
          onChangeText={setSearchQuery}
          autoFocus={true}
          onSubmitEditing={handleSubmit}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="while-editing"
          onEndEditing={handleBlur}

        />
      ) : (
        <TouchableOpacity onPress={() => setSearchActive(true)} style={styles.searchIconContainer}>
          <Ionicons name="search" size={24} color="#333" />
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