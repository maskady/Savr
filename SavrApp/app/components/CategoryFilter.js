import React, { useContext, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, Appearance } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SettingsContext from '../contexts/SettingsContext';
import Search from './Search';
import { businessCategoriesColors } from '../constants/businessCategories';
import getStyles from '../styles/AppStyles';

const CategoryFilter = ({
  categories,
  activeCategories,
  toggleCategory,
  searchActive,
  setSearchActive,
  searchQuery,
  onSearchQueryChange,
  searchComponent=false,
}) => {
  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  const sortedCategories = categories.sort((a, b) => {
    // Custom sorting logic: more important categories in begginning
    // 'bakery' > 'grocery' > 'restaurant' > 'cafe' > > the rest goes alphabetically > 'other' at the end
    const order = {
      bakery: 1,
      grocery: 2,
      florist: 3,
      restaurant: 5,
      cafe: 4,
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
        styles.categoryFilter.categoryButton,
        {
          backgroundColor: businessCategoriesColors[item.id] || 'transparent',
          opacity: activeCategories.includes(item.id) ? 1 : 0.5,
        },
      ]}
    >
      <View style={styles.categoryFilter.leftIconContainer}>
        <MaterialIcons
          name={item.icon}
          size={20}
          color={
            activeCategories.includes(item.id)
              ? styles.categoryFilter.iconActive.color
              : styles.categoryFilter.iconInactive.color
          }
        />
      </View>
      <Text
        style={[
          styles.categoryFilter.categoryText,
          {
            color: activeCategories.includes(item.id)
              ? darkMode ? styles.categoryFilter.iconActive.color : styles.categoryFilter.iconActive.color
              : darkMode ? styles.categoryFilter.iconInactive.color : styles.categoryFilter.iconInactive.color,
          },
        ]}
      >
        {item.name}
      </Text>
      <View style={styles.categoryFilter.rightSpacer} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.categoryFilter.categoryContainer}>
      <FlatList
        horizontal
        data={sortedCategories}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
      {searchComponent && 
        <Search
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />}
    </View>
  );
};

export default CategoryFilter;