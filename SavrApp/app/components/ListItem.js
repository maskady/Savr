import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { SettingsContext } from '../contexts/SettingsContext';
import { getDistance } from 'geolib';
import { ChevronRight } from 'lucide-react-native';
import { HOST_URL } from '@env';

const ListItem = ({ shop, onSelect, userLocation }) => {
  const {darkMode} = useContext(SettingsContext);

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  

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
    // Delete the last slash if it exists
    const host_url_without_slash = HOST_URL.endsWith('/') ? HOST_URL.slice(0, -1) : HOST_URL;
    return `${host_url_without_slash}${url}`;
  };

  // Get image URL for the shop
  let imageUrl = 'https://via.placeholder.com/80?text=No+Image';
  
  // Check if shop has images array
  if (shop.images && shop.images.length > 0) {
    imageUrl = getImageUrl(shop.images[0].url);
  } 

  return (
    <TouchableOpacity 
      style={styles.listItem.container}
      onPress={() => onSelect(shop)}
    >
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.listItem.image} 
      />
      <View style={styles.listItem.info}>
        <Text style={styles.listItem.title}>{shop.name}</Text>
        <Text style={styles.listItem.subtitle}>
          {shop.rating ? `${shop.rating} (${shop.ratings || 0} reviews) • ` : "(0 reviews) • "}{distance && `${distance} ${distanceUnit}`}
        </Text>
        {shop.category && (
          <Text style={styles.listItem.categoryText}>
            {shop.category}
          </Text>
        )}
      </View>
      <View style={styles.listItem.arrowContainer}>
        <ChevronRight size={24} color={darkMode ? '#6200ea' : '#007AFF'} />
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;