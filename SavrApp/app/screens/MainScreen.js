import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { throttle } from 'lodash';
import haversine from 'haversine-distance';
import Search from '../components/Search';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { businessCategories } from '../constants/businessCategories';
import { getShops } from '../utils/api'; // import the API call
import { SettingsContext } from '../contexts/SettingsContext';
import styles from '../styles/AppStyles';

const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  
  // Default location (Oulu, Finland)
  const [region, setRegion] = useState({
    latitude: 65.0121,
    longitude: 25.4681,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  
  // State for the shops data from the API
  const [shops, setShops] = useState([]);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchShopsThrottled = useMemo(() => throttle(async (region, radius) => {
    const data = await getShops(region.latitude, region.longitude, radius);
    setShops(data);
    setLastFetchedRegion(region);
    if (data?.length > 0) console.log('Fetched shops (first one):', data[0]);
  }, 500), []);

  const fetchShopsIfNeeded = (region) => {
    // Calculate the vertical distance of the visible map in kilometers:
    const computedRadius = Math.min(region.latitudeDelta * 111, 100);
    console.log('Computed radius:', region.latitudeDelta * 111, 'km');

    // If no previous region or if the user has panned sufficiently (threshold: one-third of computed radius in meters), then fetch
    if (!lastFetchedRegion || haversine(
      { latitude: region.latitude, longitude: region.longitude },
      { latitude: lastFetchedRegion.latitude, longitude: lastFetchedRegion.longitude }
    ) > computedRadius * 1000 / 3) {
      fetchShopsThrottled(region, computedRadius);
    }
  };

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      let currentRegion = region; // default region if permission not granted
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation) {
          currentRegion = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          };
          console.log('Updating current location...');
          setRegion(currentRegion);
        }
      }
      console.log('Current region:', currentRegion);
      
      // Now fetch the shops using the current region.
      // Adjust the radius value as necessary.
      fetchShopsIfNeeded(currentRegion);
    })();
  }, []); 

  // Handle shop selection
  const handleSelect = (shop) => {
    console.log('Selected:', shop.name);
  };

  const renderItem = ({ item }) => (
    <ListItem shop={item} onSelect={handleSelect} region={region}/>
  );

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <CategoryFilter 
            categories={businessCategories} 
            searchActive={searchActive} 
            setSearchActive={setSearchActive} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} />
      <View style={localStyles.mapContainer}>
        <MapSection region={region} setRegion={setRegion} shops={shops} onRegionChange={fetchShopsIfNeeded} />
        <View style={localStyles.searchOverlay}>
          
        </View>
      </View>
      <BottomSheet> 
        <FlatList
          data={shops}
          keyExtractor={(shop) => shop.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </BottomSheet>
    </View>
  );
};

const localStyles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative'
  },
  searchOverlay: {
    position: 'absolute',
    top: 30,
    left: 5,
    right: 5,
    zIndex: 100,
  }
});

export default MainScreen;