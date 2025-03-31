import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ListItem = ({ item, isDarkMode, onSelect }) => {
  return (
    <View style={[styles.listItem, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
      <Image source={item.image} style={styles.listItemImage} />
      <View style={styles.listItemInfo}>
        <Text style={[styles.listItemTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
        <Text style={[styles.listItemSubtitle, { color: isDarkMode ? '#bbb' : '#666' }]}>
          {item.rating} ({item.reviews} reviews) • {item.distance} km
        </Text>
        <Text style={[styles.listItemPrice, { color: isDarkMode ? '#fff' : '#000' }]}>${item.price}</Text>
      </View>
      <TouchableOpacity style={[styles.selectButton, { backgroundColor: isDarkMode ? '#6200ea' : '#007AFF' }]} onPress={() => onSelect(item)}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
  },
  listItemInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItemSubtitle: {
    fontSize: 14,
    marginVertical: 4,
  },
  listItemPrice: {
    fontSize: 16,
  },
  selectButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListItem;