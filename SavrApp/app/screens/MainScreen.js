// TODO: Refactor styles
import React, { useState, useEffect, useContext } from 'react';

import { View, FlatList, ActivityIndicator, Text, Appearance, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { businessCategories } from '../constants/businessCategories';
import SettingsContext from '../contexts/SettingsContext';
import getStyles from '../styles/AppStyles';
import ShopContext from '../contexts/ShopContext';
import getUserLocation, {  startLocationUpdates, stopLocationUpdates, isDifferentRegion } from '../utils/location';
import haversine from 'haversine-distance';

const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  // Start with region as null while we fetch the user's location.
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  
  const {
    shops,
    filteredShops,
    searchQuery,
    setSearchQuery,
    activeCategories,
    fetchShopsIfNeeded,
    setActiveCategories,
    filterShopsByRegion,
    regionBoundedShops,
    currentMapRegion,
    setCurrentMapRegion,
  } = useContext(ShopContext);


  useEffect(() => {
    // Start location updates
    const intervalId = startLocationUpdates(1); // Update every 1 minute
    setLocationUpdateInterval(intervalId);
    
    // Initialize location for map
    const initializeLocation = async () => {
      const currentRegion = await getUserLocation();

      setRegion(currentRegion);
      setUserLocation(currentRegion);

      // Fetch shops based on current region
      fetchShopsIfNeeded(currentRegion);
      // Initialize regionBoundedShops for initial load
      setCurrentMapRegion(currentRegion);
      filterShopsByRegion(currentRegion);
      setIsLoading(false);
    };

    initializeLocation();

    // Cleanup function
    return () => {
      if (locationUpdateInterval) {
        stopLocationUpdates(locationUpdateInterval);
      }
    };
  }, []);

  const onSearchQueryChange = (query) => {
    const normalized = query.toLowerCase();
    setSearchQuery(normalized);
    // Keep the search input open even when cleared
    if (!searchActive) {
      setSearchActive(true);
    }
  };



  // While loading, display the activity indicator with a message.
  if (isLoading || region === null) {
    return (
      <View style={[styles.flexContainer, styles.mainScreen.loadingContainer]}>
        <StatusBar
          barStyle={styles.statusBar.barStyle}
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <ActivityIndicator style={styles.mainScreen.loadingIndicator}/>
        <Text style={styles.mainScreen.acquiringText}>
          Acquiring location...
        </Text>
      </View>
    );
  }

  // Function to toggle categories.
  const toggleCategory = (categoryId) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelect = (shop) => {
    navigation.navigate('Shop', { shop });
  };

  const renderItem = ({ item }) => (
    <ListItem shop={item} onSelect={handleSelect} userLocation={userLocation} />
  );

  return (
    <View style={styles.flexContainer}>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <CategoryFilter
        categories={Object.values(businessCategories)}
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        searchComponent={true}
      />
      <View style={styles.mapContainer}>
        <MapSection
          region={region}
          onRegionChange={(newRegion) => {
            if (newRegion && isDifferentRegion(newRegion, region)) {  
              setRegion(newRegion);
              fetchShopsIfNeeded(newRegion);
            }

            filterShopsByRegion(newRegion);
          }}
          shops={filteredShops}
          onShopSelect={handleSelect}
          getUserLocation={getUserLocation}
          setRegion={setRegion}
        />
        <View style={styles.searchOverlay}></View>
      </View>
      <BottomSheet>
        <FlatList
          data={regionBoundedShops}
          keyExtractor={(shop) => shop.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScreen.bottomSheetContent}
        />
      </BottomSheet>
    </View>
  );
};

export default MainScreen;