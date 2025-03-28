import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Appearance } from 'react-native';
import * as Location from 'expo-location';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import MapSection from '../components/MapSection';
import BottomSheet from '../components/BottomSheet';
import ListItem from '../components/ListItem';
import { categories, listings } from '../temp_DB/data';

const MainScreen = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [region, setRegion] = useState({
      latitude: 65.0121,
      longitude: 25.4681,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

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

  const isDarkMode = theme === 'dark';

  const handleSelect = (item) => {
    console.log('Selected:', item.title);
  };

  const renderItem = ({ item }) => (
    <ListItem item={item} isDarkMode={isDarkMode} onSelect={handleSelect} />
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Header isDarkMode={isDarkMode} />
      <CategoryFilter categories={categories} isDarkMode={isDarkMode} />
      <MapSection region={region} listings={listings} isDarkMode={isDarkMode} setRegion={setRegion} />
      <BottomSheet isDarkMode={isDarkMode}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});