import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { throttle } from 'lodash';
import haversine from 'haversine-distance';
import { useNavigation } from '@react-navigation/native';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { businessCategories } from '../constants/businessCategories';
import { getShops } from '../utils/api';
import { SettingsContext } from '../contexts/SettingsContext';
import styles from '../styles/AppStyles';
import ImageUploadScreen from './ImageUploadScreen';
import ImageUploadModal from '../components/ImageUploadModal';
import { Button, Text } from 'react-native';

const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();

  // Default location (Oulu, Finland)
  const [region, setRegion] = useState({
    latitude: 65.0121,
    longitude: 25.4681,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  
  // State for the shops data from the API
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  // Filter shops based on active categories.
  const [filteredShops, setFilteredShops] = useState([]);
  
  // Filtering related state
  // Convert businessCategories from dict to array of keys for default active categories.
  const [activeCategories, setActiveCategories] = useState(
    Object.keys(businessCategories)
  );
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchShopsThrottled = useMemo(
    () =>
      throttle(async (region, radius) => {
        const data = await getShops(region.latitude, region.longitude, radius);
        setShops(data);
        const allData = [...allShops, ...data].filter((shop, index, self) =>
          index === self.findIndex((t) => t.id === shop.id)
        );
        setAllShops(allData);
      }, 500),
    [allShops]
  );
  
  // Function to calculate radius (in kilometers)
  const calculateRadius = (region) => {
    const { latitude, latitudeDelta, longitudeDelta } = region;
    const verticalDistanceKm = latitudeDelta * 111;
    const horizontalDistanceKm = longitudeDelta * 111 * Math.cos(latitude * (Math.PI / 180));
    return Math.min(Math.max(verticalDistanceKm, horizontalDistanceKm) / 2, 100);
  };

  // Compare with last fetched region to decide whether to fetch shops
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const fetchShopsIfNeeded = (currentRegion) => {
    const computedRadius = calculateRadius(currentRegion);
    if (
      !lastFetchedRegion ||
      haversine(
        { latitude: currentRegion.latitude, longitude: currentRegion.longitude },
        { latitude: lastFetchedRegion.latitude, longitude: lastFetchedRegion.longitude }
      ) > computedRadius * 1000 / 3
    ) {
      fetchShopsThrottled(currentRegion, computedRadius);
      setLastFetchedRegion(currentRegion);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let currentRegion = region;
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
      fetchShopsIfNeeded(currentRegion);
    })();
  }, []);

  // Toggle the active/inactive state of a category.
  // Note: Use a useEffect (below) to update filteredShops when activeCategories changes.
  const toggleCategory = (categoryId) => {
    console.log('Toggle category:', categoryId);
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Update filtered shops whenever shops or activeCategories changes.
  useEffect(() => {
    const filtered = shops.filter((shop) => activeCategories.includes(shop.primaryCategory));
    if (activeCategories.includes('other')) {
      const otherShops = shops.filter((shop) => !shop.primaryCategory);
      setFilteredShops([...filtered, ...otherShops]);
    } else {
      setFilteredShops(filtered);
    }
  }, [activeCategories, shops]);

  const handleSelect = (shop) => {
    console.log('Selected:', shop.name);
    navigation.navigate('ShopScreen', { shop });
  };

  const renderItem = ({ item }) => (
    <ListItem shop={item} onSelect={handleSelect} region={region} />
  );

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <CategoryFilter
        // Convert dictionary to array before passing.
        categories={Object.values(businessCategories)}
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <View style={localStyles.mapContainer}>
        <MapSection
          region={region}
          setRegion={setRegion}
          shops={filteredShops}
          onRegionChange={fetchShopsIfNeeded}
          onShopSelect={handleSelect}
        />
        <View style={localStyles.searchOverlay}></View>
      </View>
      <BottomSheet>
        <FlatList
          data={filteredShops}
          keyExtractor={(shop) => shop.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 14, paddingHorizontal: 1 }}
        />
      </BottomSheet>
    </View>
  );
};

const localStyles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  searchOverlay: {
    position: 'absolute',
    top: 30,
    left: 5,
    right: 5,
    zIndex: 100,
  },
});

export default MainScreen;