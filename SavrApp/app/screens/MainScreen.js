// screens/MainScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Appearance,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const MainScreen = () => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });

  // Detect dark mode changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  // Request location
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

  // Sample data
  const categories = [
    { id: '1', name: 'Restaurant', icon: 'local-restaurant' },
    { id: '2', name: 'Bakery', icon: 'bakery-dining' },
    { id: '3', name: 'Flowers', icon: 'local-florist' },
    { id: '4', name: 'More', icon: 'more-horiz' },
  ];

  const listings = [
    {
      id: '1',
      title: 'Restaurant 1',
      reviews: 500,
      rating: 4.8,
      distance: 1.2,
      price: 3,
      image: './assets/images/businesses/restaurant-1.jpg',
    },
    {
      id: '2',
      title: 'Bakery 1',
      reviews: 210,
      rating: 4.6,
      distance: 2.5,
      price: 5.5,
      image: './assets/images/businesses/bakery.jpg',
    },
  ];

  // Bottom sheet logic
  const screenHeight = Dimensions.get('window').height;
  const SHEET_HEIGHT = screenHeight * 0.45; // height of the bottom sheet
  const PEEK_HEIGHT = 60; // always visible portion when "hidden"
  const sheetAnim = useRef(new Animated.Value(0)).current; // from 0 to (SHEET_HEIGHT - PEEK_HEIGHT)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: (_, gs) => {
        const newVal = Math.min(Math.max(gs.dy, 0), SHEET_HEIGHT - PEEK_HEIGHT);
        sheetAnim.setValue(newVal);
      },
      onPanResponderRelease: (_, gs) => {
        const halfway = (SHEET_HEIGHT - PEEK_HEIGHT) / 2;
        if (gs.dy > halfway) {
          Animated.timing(sheetAnim, {
            toValue: SHEET_HEIGHT - PEEK_HEIGHT,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(sheetAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSelect = (item) => {
    console.log('Selected:', item.title);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.listItem, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemInfo}>
        <Text style={[styles.listItemTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
        <Text style={[styles.listItemSubtitle, { color: isDarkMode ? '#bbb' : '#666' }]}>
          {item.rating} ({item.reviews} reviews) • {item.distance} km
        </Text>
        <Text style={[styles.listItemPrice, { color: isDarkMode ? '#fff' : '#000' }]}>
          ${item.price}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.selectButton, { backgroundColor: isDarkMode ? '#6200ea' : '#007AFF' }]}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      {/* Header / Search */}
      <View style={styles.header}>
        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#333' : '#f2f2f2' }]}>
          <Ionicons
            name="search"
            size={20}
            color={isDarkMode ? '#ccc' : '#888'}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Oulu"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#000' }]}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={[styles.categoryContainer, { borderBottomColor: isDarkMode ? '#555' : '#ccc', backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryButton}>
              <MaterialIcons name={item.icon} size={20} color={isDarkMode ? '#ccc' : '#333'} />
              <Text style={[styles.categoryText, { color: isDarkMode ? '#ccc' : '#000' }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Full-screen Map */}
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {listings.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: region.latitude, longitude: region.longitude }}
              title={loc.title}
              description={`${loc.rating} stars`}
            >
              <View style={[styles.markerContainer, { backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ddd' }]}>
                <Text style={[styles.markerText, { color: isDarkMode ? '#fff' : '#000' }]}>${loc.price}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Bottom sheet */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.bottomSheet,
          {
            backgroundColor: isDarkMode ? '#121212' : '#fff',
            height: SHEET_HEIGHT,
            transform: [{ translateY: sheetAnim }],
          },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleBar} />
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </Animated.View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  dateText: {
    fontSize: 14,
  },
  categoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    zIndex: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 14,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  markerText: {
    fontWeight: 'bold',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#888',
    marginVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
  },
  listItemInfo: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItemSubtitle: {
    fontSize: 14,
    marginVertical: 4,
  },
  listItemPrice: {
    fontSize: 16,
  },
  selectButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});