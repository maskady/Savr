import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, ActivityIndicator, Appearance, StatusBar } from 'react-native';
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


const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [styles, setStyles] = useState(getStyles());

  // Default location (Oulu, Finland)
  const [region, setRegion] = useState({
    latitude: 65.0121,
    longitude: 25.4681,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });

  const {
    shops,
    allShops,
    filteredShops,
    activeCategories,
    fetchShopsIfNeeded,
    setActiveCategories,
  } = useContext(ShopContext);


  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserLocation = async () => {
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
    return currentRegion;
  };

  useEffect(() => {
    const f = async () => {
      const currentRegion = await getUserLocation();
      fetchShopsIfNeeded(currentRegion);
    };
    f();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());
    });

    subscription.remove();
    setIsLoading(false);
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


  const handleSelect = (shop) => {
    console.log('Selected:', shop.name);
    navigation.navigate('Shop', { shop });
  };

  const renderItem = ({ item }) => (
    <ListItem shop={item} onSelect={handleSelect} region={region} />
  );

  if (isLoading) {
    return (
      <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#121212'} />
      </View>
    );
  }

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
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
      <View style={styles.mapContainer}>
        <MapSection
          region={region}
          setRegion={setRegion}
          shops={filteredShops}
          onRegionChange={fetchShopsIfNeeded}
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