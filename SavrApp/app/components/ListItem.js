import React, {useContext} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SettingsContext } from '../contexts/SettingsContext';
import { getDistance } from 'geolib';

const ListItem = ({ shop, onSelect, region }) => {
  const {darkMode} = useContext(SettingsContext);

  let distance = null;
  let distanceUnit = null;
  if (region.latitude && shop.latitude && region.longitude && shop.longitude) {
    distance = getDistance({latitude: region.latitude, longitude: region.longitude}, {latitude: shop.latitude, longitude: shop.longitude});
    if (distance > 1000) {
      distance = (distance / 1000).toFixed(1); // Convert to km and round to 1 decimal place
      distanceUnit = 'km';
    } else {
      distance = distance.toFixed(0); // Keep in meters
      distanceUnit = 'm';
    }
  }

  return (
    <View style={[styles.listItem, { backgroundColor: darkMode ? '#1e1e1e' : '#fff' }]}>
      {shop.image && <Image source={shop.image} style={styles.listItemImage} />}
      <View style={styles.listItemInfo}>
        <Text style={[styles.listItemTitle, { color: darkMode ? '#fff' : '#000' }]}>{shop.name}</Text>
        <Text style={[styles.listItemSubtitle, { color: darkMode ? '#bbb' : '#666' }]}>
          {shop.rating ? `${shop.rating} (${shop.ratings} reviews) • ` : "(0 reviews) • "}{distance && `${distance} ${distanceUnit}`}
        </Text>
        {/*<Text style={[styles.listItemPrice, { color: darkMode ? '#fff' : '#000' }]}>${shop.price}</Text>*/}
      </View>
      <TouchableOpacity style={[styles.selectButton, { backgroundColor: darkMode ? '#6200ea' : '#007AFF' }]} onPress={() => onSelect(shop)}>
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