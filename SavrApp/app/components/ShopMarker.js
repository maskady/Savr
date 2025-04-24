import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, Platform } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { businessCategoriesColors } from '../constants/businessCategories';
import getStyles from '../styles/AppStyles';

export default React.memo(function ShopMarker({ shop, number, onPress }) {
  const styles = getStyles();
  const category = shop.primaryCategory ? shop.primaryCategory : 'Unknown';
  const color = businessCategoriesColors[category] || businessCategoriesColors['other'] || 'lightgrey';

  return (
    <Marker
      coordinate={{ 
        latitude: parseFloat(shop.latitude),
        longitude: parseFloat(shop.longitude)
      }}
      onPress={onPress}
    >
      <View style={[styles.pinContainer]}>
        <FontAwesome6 
          name="location-pin" 
          size={Platform.OS === 'ios' ? 40 : 33} 
          style={styles.locationPin} 
          color={color} 
        />
        <Text style={[styles.pinText]}>
          {number}
        </Text>
      </View>
    </Marker>
  );
}, (prev, next) => {
  const isEqual = prev.shop.id === next.shop.id && prev.number === next.number;
  console.log('ShopMarker equal check:', isEqual);
  return isEqual;
}); 