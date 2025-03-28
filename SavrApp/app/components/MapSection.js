import React from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapSection = ({ region, listings, isDarkMode, setRegion }) => {
  return (
    <MapView style={StyleSheet.absoluteFillObject} region={region} onRegionChangeComplete={setRegion}>
      {listings.map((loc) => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title={loc.title}
          description={`${loc.rating} stars`}
        >
          <MarkerView isDarkMode={isDarkMode} price={loc.price} />
        </Marker>
      ))}
    </MapView>
  );
};

const MarkerView = ({ isDarkMode, price }) => (
  <React.Fragment>
    <Text style={[styles.markerText, { color: isDarkMode ? '#fff' : '#000' }]}>${price}</Text>
  </React.Fragment>
);

const styles = StyleSheet.create({
  markerText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default MapSection;