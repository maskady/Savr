import React, {useContext} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SettingsContext } from '../contexts/SettingsContext';
import { getDistance } from 'geolib';
import { ChevronRight } from 'lucide-react-native';
import { HOST_URL } from '@env';

const ListItem = ({ shop, onSelect, userLocation }) => {
  const {darkMode} = useContext(SettingsContext);

  let distance = null;
  let distanceUnit = null;

  if (userLocation && userLocation.latitude && shop.latitude && userLocation.longitude && shop.longitude) {

    distance = getDistance({latitude: userLocation.latitude, longitude: userLocation.longitude}, {latitude: shop.latitude, longitude: shop.longitude});
    if (distance > 1000) {
      distance = (distance / 1000).toFixed(1); // Convert to km and round to 1 decimal place
      distanceUnit = 'km';
    } else {
      distance = distance.toFixed(0); // Keep in meters
      distanceUnit = 'm';
    }
  }

  // Get full image URL
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/80?text=No+Image';
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    return `${HOST_URL}${url}`;
  };

  // Get image URL for the shop
  let imageUrl = 'https://via.placeholder.com/80?text=No+Image';
  
  // Check if shop has images array
  if (shop.images && shop.images.length > 0) {
    imageUrl = getImageUrl(shop.images[0].url);
  } 

  return (
    <TouchableOpacity 
      style={[styles.listItem, { backgroundColor: darkMode ? '#1e1e1e' : '#fff' }]}
      onPress={() => onSelect(shop)}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.listItemImage} 
      />
      <View style={styles.listItemInfo}>
        <Text style={[styles.listItemTitle, { color: darkMode ? '#fff' : '#000' }]}>{shop.name}</Text>
        <Text style={[styles.listItemSubtitle, { color: darkMode ? '#bbb' : '#666' }]}>
          {shop.rating ? `${shop.rating} (${shop.ratings || 0} reviews) • ` : "(0 reviews) • "}{distance && `${distance} ${distanceUnit}`}
        </Text>
        {shop.category && (
          <Text style={[styles.categoryText, { color: darkMode ? '#aaa' : '#888' }]}>
            {shop.category}
          </Text>
        )}
      </View>
      <View style={styles.arrowContainer}>
        <ChevronRight size={24} color={darkMode ? '#6200ea' : '#007AFF'} />
      </View>
    </TouchableOpacity>
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
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
  },
  arrowContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});

export default ListItem;