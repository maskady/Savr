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
import MapDemo from '../components/MapDemo';

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
        console.log('Fetching shops with radius:', FETCH_RADIUS);
        console.log('Current region:', currentRegion);
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

  return (
    //<MapDemo></MapDemo>
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <Header />
      <CategoryFilter categories={businessCategories} />
      <MapSection region={region} setRegion={setRegion} shops={shops} />
      <BottomSheet> 
        <FlatList
          data={shops}
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