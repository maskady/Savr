import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';
import { debounce } from 'lodash';
import { businessCategoriesColors } from '../constants/businessCategories';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getStyles from '../styles/AppStyles';

const MapSection = ({ region, setRegion, shops, onRegionChange, onShopSelect, getUserLocation }) => {

  const [styles, setStyles] = useState(getStyles());

  const [clusters, setClusters] = useState([]);

  // Clustering configuration
  const radiusThreshold = 32; // in pixels, for how close pins should be to cluster
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

        >
          <View style={[styles.clusterContainer, { backgroundColor: 'grey', borderColor: 'black' }]}> 
            <Text style={styles.clusterText}>{pointCount}</Text>
          </View>
        </Marker>
      );
    }

    const shop = shops.find(shop => shop.id === shopId) || {};
    const category = shop.primaryCategory ? shop.primaryCategory : 'Unknown';
    const color = businessCategoriesColors[category] || 'lightgreen';
    const displayRating = rating || 0;

    return (
      <Marker
        key={shopId}
        coordinate={{ latitude, longitude }}
        pinColor={color}
        onPress={() => onShopSelect && onShopSelect(shop)}
      >
        <View style={[styles.clusterContainer, { backgroundColor: color }]}> 
          <Text style={styles.clusterText}>{displayRating}</Text>
        </View>
      </Marker>
    );
  };

  // Define the debouncedUpdateClusters function using useMemo
  const debouncedUpdateClusters = useMemo(
    () => debounce((rgn) => {
      updateClusters(rgn);
    }, 500),
    []
  );

  const locateMyself = async () => {
    const newRegion = await getUserLocation();
    if (onRegionChange) {
      onRegionChange(newRegion);
    }
    updateClusters(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          debouncedUpdateClusters(newRegion);
          onRegionChange && onRegionChange(newRegion);
        }}
        showsUserLocation={true}
        showsCompass={true}
        showsMyLocationButton={true}
        showsBuildings={true}
        showsScale={true}
        showsMyLocation={true}
      >
        {clusters.map(cluster => renderMarker(cluster))}
      </MapView>
      <TouchableOpacity style={styles.locateButton} onPress={locateMyself}>
        <MaterialIcons name="my-location" style={styles.myLocationIcon} />
      </TouchableOpacity>
    </View>
  );
};


export default MapSection;