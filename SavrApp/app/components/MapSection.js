import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';

const MapSection = ({ region, setRegion, shops }) => {
  const [clusters, setClusters] = useState([]);

  // Clustering configuration
  const radiusThreshold = 30; // in pixels, for how close pins should be to cluster
  const maxZoom = 20; // maximum zoom level for clustering
  const padding = 0.5; // additional padding factor for bounds (adjust as needed)
  const superclusterRef = useRef(new Supercluster({ radius: radiusThreshold, maxZoom: maxZoom }));

  // Build geoJSON from shops data
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

  // Load the data into Supercluster whenever the geoJSON changes
  useEffect(() => {
    superclusterRef.current.load(geoJson);
    if (region) {
      updateClusters(region);
    }
  }, [geoJson]);

  // Update clusters based on the current region with additional padding for smoother transitions
  const updateClusters = (newRegion) => {
    const { longitudeDelta, latitudeDelta, latitude, longitude } = newRegion;
    const bounds = [
      longitude - longitudeDelta * (0.5 + padding),
      latitude - latitudeDelta * (0.5 + padding),
      longitude + longitudeDelta * (0.5 + padding),
      latitude + latitudeDelta * (0.5 + padding)
    ];
    const zoom = Math.floor(Math.log2(360 / longitudeDelta));
    const clusters = superclusterRef.current.getClusters(bounds, zoom);
    setClusters(clusters);
  };

  // Render either an individual marker or a cluster marker based on properties
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
              maxZoom
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