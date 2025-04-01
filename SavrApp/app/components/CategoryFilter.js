import React, {useContext} from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SettingsContext } from '../contexts/SettingsContext';

const CategoryFilter = ({ categories }) => {
  const { darkMode } = useContext(SettingsContext);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <MaterialIcons name={item.icon} size={20} color={darkMode ? '#ccc' : '#333'} />
      <Text style={[styles.categoryText, { color: darkMode ? '#ccc' : '#000' }]}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.categoryContainer, { borderBottomColor: darkMode ? '#555' : '#ccc', backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    zIndex: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 14,
  },
});

export default CategoryFilter;