// components/ShopMapSection.js
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function ShopMapSection({
  latitude,
  longitude,
  name,
  onNavigate,
  colors
}) {
  if (latitude == null || longitude == null) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onNavigate}
      >
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});