import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Appearance } from 'react-native';
import * as Location from 'expo-location';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { categories, listings } from '../temp_DB/data';
import { SettingsContext } from '../contexts/SettingsContext';
import styles from '../styles/AppStyles';

const MainScreen = () => {
  const { darkMode } = useContext(SettingsContext);

  const [region, setRegion] = useState({
      latitude: 65.0121,
      longitude: 25.4681,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation) {
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          });
        }
      }
    })();
  }, []);

  const handleSelect = (item) => {
    console.log('Selected:', item.title);
  };

  const renderItem = ({ item }) => (
    <ListItem item={item} onSelect={handleSelect} />
  );

  return (
    <View style={[styles.flexContainer, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <Header/>
      <CategoryFilter categories={categories}/>
      <MapSection region={region} listings={listings} setRegion={setRegion} />
      <BottomSheet >
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </BottomSheet>
    </View>
  );
};

export default MainScreen;

