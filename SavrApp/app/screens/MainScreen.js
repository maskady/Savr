import React, { useState, useEffect, useContext } from 'react';

import { View, FlatList, StyleSheet, ActivityIndicator, Text, Appearance, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { businessCategories } from '../constants/businessCategories';
import { SettingsContext } from '../contexts/SettingsContext';
import getStyles from '../styles/AppStyles';
import { ShopContext } from '../contexts/ShopContext';

const initialRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};

const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();
  const [styles, setStyles] = useState(getStyles());
  
  // Start with region as null while we fetch the user's location.
  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    shops,
    filteredShops,
    activeCategories,
    fetchShopsIfNeeded,
    setActiveCategories,
  } = useContext(ShopContext);

  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modified getUserLocation returns the user's location or a default fallback.
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation) {
          return {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          };
        }
      }
    } catch (error) {
      console.error('Error getting user location:', error);
    }
    // Fallback to default region if permission is not granted or an error occurs.
    return initialRegion;
  };

  useEffect(() => {
    // Immediately start fetching the location.
    const initializeLocation = async () => {
      const currentRegion = await getUserLocation();
      setRegion(currentRegion);
      // Now fetch the shops based on the current region.
      fetchShopsIfNeeded(currentRegion);
      setIsLoading(false);
    };

    initializeLocation();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());
    });

    
    setIsLoading(false);
    return () => {
      subscription.remove();
    }
  }, []);

  // While loading, display the activity indicator with a message.
  if (isLoading || region === null) {
    return (
      <View
        style={[
          styles.flexContainer,
          {
            backgroundColor: darkMode ? '#121212' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <StatusBar
          barStyle={styles.statusBar.barStyle}
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#121212'} />
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: darkMode ? '#fff' : '#121212', fontSize: 16 }}>
            Acquiring location...
          </Text>
        </View>
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
    <ListItem shop={item} onSelect={handleSelect} region={region} />
  );

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
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
        setSearchQuery={setSearchQuery}
      />
      <View style={styles.mapContainer}>
        <MapSection
          region={region}
          setRegion={(newRegion) => {
            setRegion(newRegion);
            fetchShopsIfNeeded(newRegion);
          }}
          shops={filteredShops}
          onRegionChange={(newRegion) => {
            setRegion(newRegion);
            fetchShopsIfNeeded(newRegion);
          }}
          onShopSelect={handleSelect}
        />
        <View style={styles.searchOverlay}></View>
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

export default MainScreen;