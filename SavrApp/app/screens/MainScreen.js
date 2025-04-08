import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList } from 'react-native';
import * as Location from 'expo-location';
import Header from '../components/Header';
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
  const FETCH_RADIUS = 10; // in km
   
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
      try {
        const data = await getShops(currentRegion.latitude, currentRegion.longitude, FETCH_RADIUS);
        setShops(data);
        console.log('Fetched shops (only 3rd one):', data[2]);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    })();
  }, []); 

  const handleSelect = (item) => {
    console.log('Selected:', item.title);
  };

  const renderItem = ({ item }) => (
    <ListItem item={item} onSelect={handleSelect} region={region}/>
  );

  const tempShops = [
    {
      rating: 4.5,
      id: 1,
      longitude: 25.2681,
      latitude: 65.0221,
    },
    {
      rating: 3.8,
      id: 2,
      longitude: 25.5681,
      latitude: 65.0141,
    },
    {
      rating: 4.0,
      id: 3,
      longitude: 25.4681,
      latitude: 65.0121,
    },
  ]

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <Header />
      <CategoryFilter categories={businessCategories} />
      <MapSection region={region} setRegion={setRegion} shops={tempShops} />
      <BottomSheet> 
        <FlatList
          data={tempShops}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </BottomSheet>
    </View>
  );
};

export default MainScreen;