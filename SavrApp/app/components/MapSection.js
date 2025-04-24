import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Appearance, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Supercluster from 'supercluster';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getStyles from '../styles/AppStyles';
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
  const [mapClusters, setMapClusters] = useState([]);

  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const [mapRegion, setMapRegion] = useState(region);
  
  const mapRef = useRef(null);

  // Optimized cluster update function that only changes what's needed
  const handleMapClusterChange = useCallback((newClusters) => {
    setMapClusters((clusters) => {
      // 1) Build a sorted copy of newClusters by key
      const sortedNew = newClusters
        .slice()
        .sort((a, b) => {
          const aIsCluster = Boolean(a.properties.cluster);
          const bIsCluster = Boolean(b.properties.cluster);
          if (aIsCluster !== bIsCluster) return aIsCluster ? -1 : 1;
          const aId = aIsCluster ? a.id : a.properties.shopId;
          const bId = bIsCluster ? b.id : b.properties.shopId;
          return aId - bId;
        });

      // 2) If first load, just push all in
      if (clusters.length === 0) {
        sortedNew.forEach(c => clusters.push(c));
        console.log('Initial clusters loaded:', clusters.length);
        return clusters;
      }

      // 3) Two-pointer walk to mutate in place
      let i = 0, j = 0;
      while (j < sortedNew.length) {
        const newC = sortedNew[j];
        const newIsCluster = Boolean(newC.properties.cluster);
        const newKeyType = newIsCluster ? 'cluster' : 'shop';
        const newId      = newIsCluster ? newC.id : newC.properties.shopId;

        // If we've exhausted old clusters, just push the rest
        if (i >= clusters.length) {
          clusters.push(newC);
          i++; j++;
          continue;
        }

        const oldC = clusters[i];
        const oldIsCluster = Boolean(oldC.properties.cluster);
        const oldKeyType   = oldIsCluster ? 'cluster' : 'shop';
        const oldId        = oldIsCluster ? oldC.id : oldC.properties.shopId;

        // 3a) Keys match → maybe update count
        if (oldKeyType === newKeyType && oldId === newId) {
          if (newIsCluster && oldC.properties.point_count !== newC.properties.point_count) {
            oldC.properties.point_count = newC.properties.point_count;
          }
          i++; j++;
        
        // 3b) Old < New → oldC is gone, shift left & pop
        } else if (
          (oldKeyType === newKeyType && oldId < newId) ||
          (oldKeyType === 'cluster' && newKeyType === 'shop')
        ) {
          for (let k = i; k < clusters.length - 1; k++) {
            clusters[k] = clusters[k + 1];
          }
          clusters.pop();
          // i, j stay the same to re-compare at this index

        // 3c) Old > New → need to insert newC here
        } else {
          // push a dummy slot, shift everything right from i
          clusters.push(clusters[clusters.length - 1]);
          for (let k = clusters.length - 2; k > i; k--) {
            clusters[k] = clusters[k - 1];
          }
          clusters[i] = newC;
          i++; j++;
        }
      }

      // 4) Anything left in old beyond sortedNew.length? pop it off
      while (clusters.length > sortedNew.length) {
        clusters.pop();
      }

      return clusters;
    });
  }, []);


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


  useEffect(() => {
    setMapRegion(region);
  }, [region]);
  
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

    console.log('>>>>>>>>>>>>>>>useEffect shops');
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
        id: 'shop-' + shop.id,
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

  // Load the data into Supercluster whenever the geoJSON or region changes
  useEffect(() => {
    superclusterRef.current.load(geoJson);
    if (mapRegion) {
      updateClusters(mapRegion);
    }
  }, [geoJson]);


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
    
    // Get clusters from Supercluster with the calculated bounds and zoom
    const next = superclusterRef.current.getClusters(bounds, zoom);
    
    // Update clusters using the optimized function
    handleMapClusterChange(next);
    
    // Quick length check for setClusters (legacy code)
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

  // Memoize the cluster press handler to prevent recreating it on every render
  const handleClusterPress = useCallback((cluster) => {
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
  }, [setRegion]);

  // Memoize shop press handler
  const handleShopPress = useCallback((shop) => {
    onShopSelect && onShopSelect(shop);
  }, [onShopSelect]);

  // Memoize rendered markers to prevent unnecessary re-renders
  const renderedMarkers = useMemo(() => {
    console.log('Rendering markers, count:', mapClusters.length || clusters.length);
    
    // Use mapClusters if available, otherwise fall back to clusters
    const clustersToRender = mapClusters.length > 0 ? mapClusters : clusters;
    
    return clustersToRender.map(cluster => {
      if (cluster.properties.cluster) {
        // Calculate size based on point count
        const size = Math.min(44, 26 + (cluster.properties.point_count / 2));
        return (
          <ClusterMarker
            key={`cluster-${cluster.id}`}
            cluster={cluster}
            size={size}
            onPress={() => handleClusterPress(cluster)}
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
            onPress={() => handleShopPress(shop)}
          />
        );
      }
    });
  }, [mapClusters, clusters, shops, variantCounts, handleClusterPress, handleShopPress]);

  return (
    <View style={styles.mapSection.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
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
        userLocationUpdateInterval={5000} // Update user location every 30 seconds - Andorid specific, iOS uses the default
        userLocationFastestInterval={3000} // Fastest interval to receive updates - Android specific, iOS uses the default
      >
        {renderedMarkers}
      </MapView>
      <TouchableOpacity style={styles.locateButton} onPress={locateMyself}>
        <MaterialIcons name="my-location" size={24} style={styles.myLocationIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;