import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SettingsContext } from '../contexts/SettingsContext';

const MapSection = ({ region, listings, setRegion }) => {

  return (
    <MapView style={StyleSheet.absoluteFillObject} region={region} onRegionChangeComplete={setRegion}>
      {listings.map((loc) => (
        <Marker
          key={loc.id}
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title={loc.title}
          description={`${loc.rating} stars`}
        >
          <MarkerView price={loc.price} />
        </Marker>
      ))}
    </MapView>
  );
};

const MarkerView = ({ price }) => {
  const { currency } = useContext(SettingsContext)
  const { darkMode } = useContext(SettingsContext);
  const currencySymbol = currency.symbol;

  return (
    <React.Fragment>
      {/*<Text style={[styles.markerText, { color: darkMode ? '#fff' : '#000' }]}>
        {`${price}${currencySymbol}`}
      </Text>*/}
    </React.Fragment>
  );
};

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