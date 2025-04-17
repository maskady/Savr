import React, { useContext } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SettingsContext } from '../contexts/SettingsContext';
import Search from './Search';
import { businessCategoriesColors } from '../constants/businessCategories';

const CategoryFilter = ({
  categories,
  activeCategories,
  toggleCategory,
  searchActive,
  setSearchActive,
  searchQuery,
  setSearchQuery,
}) => {
  const { darkMode } = useContext(SettingsContext);

  const sortedCategories = categories.sort((a, b) => {
    // 'bakery' > 'grocery' > 'restaurant' > 'cafe' > 'butcher' > the rest goes alphabetically > 'other' at the end
    const order = {
      bakery: 1,
      grocery: 2,
      restaurant: 3,
      cafe: 4,
      butcher: 5,
      other: 7,
    };
    const aOrder = order[a.id] || 6;
    const bOrder = order[b.id] || 6;

    return aOrder - bOrder || a.name.localeCompare(b.name);
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item.id)}
      style={[
        styles.categoryButton,
        {
          backgroundColor: businessCategoriesColors[item.id] || 'transparent',
          opacity: activeCategories.includes(item.id) ? 1 : 0.5,
        },
      ]}
    >
      <View style={styles.leftIconContainer}>
        <MaterialIcons
          name={item.icon}
          size={20}
          color={
            activeCategories.includes(item.id)
              ? darkMode ? '#ccc' : '#333'
              : darkMode ? '#888' : '#777'
          }
        />
      </View>
      <Text
        style={[
          styles.categoryText,
          {
            color: activeCategories.includes(item.id)
              ? darkMode ? '#ccc' : '#000'
              : darkMode ? '#888' : '#777',
            textAlign: 'center',
          },
        ]}
      >
        {item.name}
      </Text>
      <View style={styles.rightSpacer} />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.categoryContainer,
        {
          borderBottomColor: darkMode ? '#555' : '#ccc',
          backgroundColor: darkMode ? '#121212' : '#fff',
        },
      ]}
    >
      <FlatList
        horizontal
        data={sortedCategories}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
      <Search
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    paddingVertical: 1,
    paddingHorizontal: 0,
    borderRadius: 6,
  },
  leftIconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSpacer: {
    width: 24,
  },
  categoryText: {
    flexShrink: 1,
    fontSize: 14,
  },
});

export default CategoryFilter;