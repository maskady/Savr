import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

const MapSection = ({ region, setRegion, shops }) => {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      region={region}
      onRegionChangeComplete={setRegion}
      showsUserLocation={true}
    >
      {shops && shops.map((shop) => {
        const productCount = shop.rating || 0; // Temporary placeholder for product count
        if (shop.latitude === null || shop.longitude === null) {
          return null; // Skip markers with null coordinates
        }
        return (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
          >
            <View style={[styles.clusterContainer, { backgroundColor: 'lightgreen' }]}>
              <Text style={styles.clusterText}>{productCount}</Text>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MapSection;