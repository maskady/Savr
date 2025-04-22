import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Appearance } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import getStyles from '../styles/AppStyles';

export default function ShopMapSection({
  latitude,
  longitude,
  name,
  onNavigate,
}) {
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  if (latitude == null || longitude == null) return null;
  return (
    <View style={styles.shopMapSection.container}>
      <MapView
        style={styles.shopMapSection.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title={name} />
      </MapView>
      <TouchableOpacity
        style={styles.shopMapSection.button}
        onPress={onNavigate}
      >
        <Text style={styles.shopMapSection.buttonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
}
