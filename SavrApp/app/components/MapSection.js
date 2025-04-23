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
  const radiusThreshold = 32; // in pixels, for how close pins should be to cluster
  const maxZoom = 20; // maximum zoom level for clustering
  const padding = 0.5; // additional padding factor for bounds (adjust as needed)
  const superclusterRef = useRef(new Supercluster({ radius: radiusThreshold, maxZoom: maxZoom }));

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

    for (const shop of shops) {
      const count = shop.availableProductsVariantCount;
      data.push({
        type: 'Feature',
        properties: { cluster: false, shopId: shop.id },
        geometry: { type: 'Point', coordinates: [shop.longitude, shop.latitude] },
      });
      countsMap[shop.id] = count;
    }

    console.log('data', data.length);
    setVariantCounts(countsMap);
    setGeoJson(data);
    let endTime = performance.now();
    console.log('fetchGeoJson', endTime - startTime, 'ms');

  }, [shops.map(s => s.id).sort().join(',')]);

  // Load the data into Supercluster whenever the geoJSON changes
  useEffect(() => {
    superclusterRef.current.load(geoJson);
    if (region) {
      updateClusters(region);
    }
  }, [geoJson]);

  // Update clusters based on the current region with additional padding for smoother transitions
  const updateClusters = (newRegion) => {
    let startTime = performance.now();
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
    let endTime = performance.now();
    console.log('updateClusters', endTime - startTime,'ms');
  };

  // Render either an individual marker or a cluster marker based on properties
  const renderMarker = (cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count: pointCount, shopId } = cluster.properties;
    const number = variantCounts[shopId] || 0;


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
          style={styles.clusterMarker}
        >
          <View style={[styles.clusterContainer]}> 
            <Text style={styles.clusterText}>{pointCount}</Text>
          </View>
        </Marker>
      );
    }

    const shop = shops.find(shop => shop.id === shopId) || {};
    const category = shop.primaryCategory ? shop.primaryCategory : 'Unknown';
    const color = businessCategoriesColors[category] || businessCategoriesColors['other'] || 'lightgrey';
    
    return (
      <Marker
        key={shopId}
        coordinate={{ latitude, longitude }}
        onPress={() => onShopSelect && onShopSelect(shop)}
      >
        <View style={[styles.pinContainer]}>
          <FontAwesome6 name="location-pin" size={Platform.OS === 'ios' ? 40 : 33} style={styles.locationPin} color={color} />
          <Text style={[styles.pinText]}>
            {number}
          </Text>
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
        {(() => {
          let time = performance.now();
          const renderedMarkers = clusters.map(cluster => renderMarker(cluster));
          let time2 = performance.now();
          console.log('renderMarkersss', time2 - time, 'ms');
          return renderedMarkers;
        })()}
      </MapView>
      <TouchableOpacity style={styles.locateButton} onPress={locateMyself}>
        <MaterialIcons name="my-location" size={24} style={styles.myLocationIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;