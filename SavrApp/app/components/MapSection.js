import React from 'react';
import ClusteredMapView from 'react-native-map-clustering';
import { StyleSheet, View, Text } from 'react-native';
import { Marker } from 'react-native-maps';


const MapSection = ({ region, setRegion, shops }) => {
  // Render a custom marker for clusters
  const renderCluster = (cluster, onPress) => {
    const { coordinate, pointCount } = cluster;
    // You could also sum product counts for all shops in the cluster if needed.
    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={[styles.clusterContainer, { backgroundColor: 'darkgreen' }]}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  

  return (
    <ClusteredMapView
      style={StyleSheet.absoluteFillObject}
      region={region}
      onRegionChangeComplete={setRegion}
      clusteringEnabled
      renderCluster={renderCluster}  // Use our custom cluster renderer
    >
      {shops.map((shop) => {
        const productCount = shop.rating || 0; {/*Replace rating with product count when available*/}
        return (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
          >
            <View style={[styles.clusterContainer, { backgroundColor: 'lightgreen' }]}>
              <Text style={styles.clusterText}>{productCount}</Text> 
            </View>
          </Marker>
        )})}
    </ClusteredMapView>
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