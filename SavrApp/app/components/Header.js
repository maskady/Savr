import React, {useContext} from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from '../contexts/SettingsContext';

const Header = ({ placeholder }) => {
  const { t } = useTranslation();
  const { darkMode } = useContext(SettingsContext);

  const cityPlaceholder = placeholder || t('common.defaultCityPlaceholder');
  
  return (
    <View style={styles.header}>
      <View style={[styles.searchBar, { backgroundColor: darkMode ? '#333' : '#f2f2f2' }]}>
        <Ionicons
          name="search"
          size={20}
          color={darkMode ? '#ccc' : '#888'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder={cityPlaceholder}
          placeholderTextColor={darkMode ? '#888' : '#666'}
          style={[styles.searchInput, { color: darkMode ? '#fff' : '#000' }]}
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