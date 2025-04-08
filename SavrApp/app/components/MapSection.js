import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';

const MapSection = ({ region, setRegion, shops }) => {
  const [clusters, setClusters] = useState([]);

  const radiusThreshold = 30; // Radius for clustering
  const maxZoom = 20; // Maximum zoom level for clustering
  const superclusterRef = useRef(new Supercluster({ radius: radiusThreshold, maxZoom: maxZoom }));

  // Build geoJson from shops data
  const geoJson = useMemo(() => {
    return shops.map(shop => ({
      type: 'Feature',
      properties: {
        cluster: false,
        shopId: shop.id,
        rating: shop.rating || 0
      },
      geometry: {
        type: 'Point',
        coordinates: [shop.longitude, shop.latitude]
      }
    }));
  }, [shops]);

  // Load geoJson data into supercluster when data changes
  useEffect(() => {
    superclusterRef.current.load(geoJson);
    if (region) {
      updateClusters(region);
    }
  }, [geoJson]);

  const updateClusters = (newRegion) => {
    const { longitudeDelta, latitudeDelta, latitude, longitude } = newRegion;
    const bounds = [
      longitude - longitudeDelta / 2,
      latitude - latitudeDelta / 2,
      longitude + longitudeDelta / 2,
      latitude + latitudeDelta / 2
    ];
    const zoom = Math.floor(Math.log2(360 / longitudeDelta));
    const clusters = superclusterRef.current.getClusters(bounds, zoom);
    setClusters(clusters);
  };

  // Render individual marker or cluster marker based on cluster properties
  const renderMarker = (cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count: pointCount, shopId, rating } = cluster.properties;
    if (isCluster) {
      return (
        <Marker
          key={`cluster-${cluster.id}`}
          coordinate={{ latitude, longitude }}
          onPress={() => {
            const expansionZoom = Math.min(
              superclusterRef.current.getClusterExpansionZoom(cluster.id),
              20
            );
            const newLongitudeDelta = 360 / Math.pow(2, expansionZoom);
            setRegion({
              latitude,
              longitude,
              latitudeDelta: newLongitudeDelta,
              longitudeDelta: newLongitudeDelta
            });
          }}
          pinColor="darkgreen"
        >
          <View style={[styles.clusterContainer, { backgroundColor: 'darkgreen' }]}> 
            <Text style={styles.clusterText}>{pointCount}</Text>
          </View>
        </Marker>
      );
    }
    return (
      <Marker
        key={shopId}
        coordinate={{ latitude, longitude }}
        pinColor="lightgreen"
      >
        <View style={[styles.clusterContainer, { backgroundColor: 'lightgreen' }]}> 
          <Text style={styles.clusterText}>{rating}</Text>
        </View>
      </Marker>
    );
  };

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={region}
      region={region}
      onRegionChangeComplete={(newRegion) => {
        setRegion(newRegion);
        updateClusters(newRegion);
      }}
      showsUserLocation={true}
    >
      {clusters.map(cluster => renderMarker(cluster))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clusterText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default MapSection;