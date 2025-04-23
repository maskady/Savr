import { View, TouchableOpacity, TextInput, Text, Appearance } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import getStyles from '../styles/AppStyles';
import { Ionicons } from '@expo/vector-icons';
import SettingsContext from '../contexts/SettingsContext';


const Search = ({ searchActive, setSearchActive, searchQuery, onSearchQueryChange }) => {
  // const route = useRoute();
  // const { searchActive, setSearchActive, searchQuery, onSearchQueryChange } = route.params || {};
  const [submitted, setSubmitted] = useState(false);
  const { darkMode } = useContext(SettingsContext);

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

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
    <View style={styles.search.header}>
      {searchActive ? (
        <TextInput
          style={styles.search.searchInput}
          placeholder="Search..."
          placeholderTextColor={styles.search.searchIcon.color}
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
        <TouchableOpacity onPress={() => setSearchActive(true)} style={styles.search.searchIconContainer}>
          {searchQuery.trim() ? (
            <Text style={styles.search.searchText}>
              {searchQuery}
            </Text>
          ) : (
            <Ionicons name="search" size={24} color={styles.search.searchIcon.color} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};


export default Search;