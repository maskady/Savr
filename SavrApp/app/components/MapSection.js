import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Appearance, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';
import { debounce } from 'lodash';
import { businessCategoriesColors } from '../constants/businessCategories';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import getStyles from '../styles/AppStyles';
import { getAvailableProductVariantsForShop } from '../utils/api';
import getUserLocation, { startLocationUpdates, stopLocationUpdates } from '../utils/location';
import ClusterMarker from './ClusterMarker';
import ShopMarker from './ShopMarker';

const MapSection = ({ region, setRegion, shops, onRegionChange, onShopSelect }) => {

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  
  const [clusters, setClusters] = useState([]);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const mapRef = useRef(null);

  // Clustering configuration
  const radiusThreshold = 40; // in pixels, for how close pins should be to cluster
  const maxZoom = 20; // maximum zoom level for clustering
  const padding = 0.5; // additional padding factor for bounds (adjust as needed)
  const superclusterRef = useRef(new Supercluster({ 
    radius: radiusThreshold, 
    maxZoom: maxZoom,
    minPoints: 2, // At least 2 points to form a cluster
  }));

  // Build geoJSON from shops data
  const [geoJson, setGeoJson] = useState([]);
  const [variantCounts, setVariantCounts] = useState({});

  // Initialize location tracking
  useEffect(() => {
    // Get initial location
    const initLocation = async () => {
      const location = await getUserLocation(1); // Get location max 1 minute old
    };
    
    initLocation();
    
    // Start periodic location updates every 30 seconds
    const intervalId = startLocationUpdates(0.5); // 0.5 minutes = 30 seconds
    setLocationUpdateInterval(intervalId);
    
    // Cleanup
    return () => {
      if (locationUpdateInterval) {
        stopLocationUpdates(locationUpdateInterval);
      }
    };
  }, []);

  useEffect(() => {
    let startTime = performance.now();
    const data = [];
    const countsMap = {};

    // Process shops into GeoJSON format
    for (const shop of shops) {
      
      if (!shop.longitude || !shop.latitude) {
        console.log('Skipping shop without coordinates:', shop.id);
        continue;  // Skip shops without proper coordinates
      }
      
      const count = shop.availableProductsVariantCount || 0;
      
      // Create GeoJSON feature
      data.push({
        type: 'Feature',
        properties: { 
          cluster: false, 
          shopId: shop.id,
          category: shop.primaryCategory
        },
        geometry: { 
          type: 'Point', 
          coordinates: [parseFloat(shop.longitude), parseFloat(shop.latitude)] 
        },
      });
      
      countsMap[shop.id] = count;
    }

    console.log('GeoJSON data prepared:', data.length, 'features');
    
    setVariantCounts(countsMap);
    setGeoJson(data);
    let endTime = performance.now();
    console.log('fetchGeoJson', endTime - startTime, 'ms');

  }, [shops.map(s => s.id).sort().join(',')]);

  // Load the data into Supercluster whenever the geoJSON changes
  useEffect(() => {
    console.log('Loading', geoJson.length, 'points into Supercluster');
    superclusterRef.current.load(geoJson);
    if (region) {
      updateClusters(region);
    }
  }, [geoJson]);

  // Debug clusters whenever they change
  useEffect(() => {
    console.log('Clusters state updated:', clusters.length, 'items');
  }, [clusters]);

  // Update clusters based on the current region with additional padding for smoother transitions
  const updateClusters = (newRegion) => {
    let startTime = performance.now();
    const { longitudeDelta, latitudeDelta, latitude, longitude } = newRegion;
    
    // Calculate bounds with padding
    const bounds = [
      longitude - longitudeDelta * (0.5 + padding),
      latitude - latitudeDelta * (0.5 + padding),
      longitude + longitudeDelta * (0.5 + padding),
      latitude + latitudeDelta * (0.5 + padding)
    ];
    
    // Calculate appropriate zoom level based on the map's current zoom
    // Lower zoom = more zoomed out, Higher zoom = more zoomed in
    const zoom = Math.max(0, Math.floor(Math.log2(360 / longitudeDelta)));
    
    console.log('Map bounds:', bounds, 'Zoom level:', zoom);
    
    // Get clusters from Supercluster with the calculated bounds and zoom
    const next = superclusterRef.current.getClusters(bounds, zoom);
    console.log('Clusters found:', next.length, 'actual clusters:', next.filter(c => c.properties.cluster).length);
    
    // Quick length check
    if (next.length === clusters.length) {
      // Deep-compare just the ids and point_counts
      let same = next.every((c, i) =>
        c.properties.cluster === clusters[i]?.properties.cluster &&
        c.id === clusters[i]?.id &&
        (c.properties.point_count ?? 1) === (clusters[i]?.properties.point_count ?? 1)
      );
      if (same) {
        console.log('Clusters unchanged, skipping update');
        return; // Nothing changed → skip setClusters
      }
    }
    
    setClusters(next);
    let endTime = performance.now();
    console.log('updateClusters', endTime - startTime,'ms');
  };

  // Function to center map on user's location
  const locateMyself = async () => {
    try {
      // Get fresh location (max 1 minute old)
      const newLocation = await getUserLocation(1);
      
      // Animate map to new location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 500);
      }
      
      // Update region state in parent component
      if (setRegion) {
        setRegion(newLocation);
      }
      
      // Update clusters
      updateClusters(newLocation);
    } catch (error) {
      console.error('Error locating user:', error);
    }
  };

  console.log('------clusters', clusters.length);
  return (
    <View style={styles.mapSection.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => {
          console.log('newregion',newRegion );
          setRegion(newRegion);
          updateClusters(newRegion);
        }}
        showsUserLocation={true}
        followsUserLocation={false} // If true, region will be updated to user's location - user cannot move on map
        showsCompass={true}
        showsMyLocationButton={false} // Disable default button, we'll use our own
        showsBuildings={false}
        showsScale={true}
        userLocationUpdateInterval={30000} // Update user location every 30 seconds - Andorid specific, iOS uses the default
        userLocationFastestInterval={10000} // Fastest interval to receive updates - Android specific, iOS uses the default
      >
        {
        
        clusters.map(cluster => {
          if (cluster.properties.cluster) {
            // Calculate size based on point count
            const size = Math.min(44, 26 + (cluster.properties.point_count / 2));
            return (
              <ClusterMarker
                key={`cluster-${cluster.id}`}
                cluster={cluster}
                size={size}
                onPress={() => {
                  console.log('Cluster pressed:', cluster.id, 'with', cluster.properties.point_count, 'points');
                  const expansionZoom = Math.min(
                    superclusterRef.current.getClusterExpansionZoom(cluster.id),
                    maxZoom
                  );
                  const newLongitudeDelta = 360 / Math.pow(2, expansionZoom);
                  const [longitude, latitude] = cluster.geometry.coordinates;
                  setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: newLongitudeDelta,
                    longitudeDelta: newLongitudeDelta
                  });
                }}
              />
            );
          } else {
            const shopId = cluster.properties.shopId;
            const shop = shops.find(shop => shop.id === shopId) || {};
            const number = variantCounts[shopId] || 0;
            return (
              <ShopMarker
                key={shopId}
                shop={shop}
                number={number}
                onPress={() => onShopSelect && onShopSelect(shop)}
              />
            );
          }
        })}
      </MapView>
      <TouchableOpacity style={styles.locateButton} onPress={locateMyself}>
        <MaterialIcons name="my-location" size={24} style={styles.myLocationIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;