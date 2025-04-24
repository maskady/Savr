import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const LOCATION_STORAGE_KEY = '@lastLocation';
const LOCATION_TIMESTAMP_KEY = '@lastLocationTimestamp';

// Default region for fallback
const DEFAULT_REGION = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.09,
  longitudeDelta: 0.04,
};

/**
 * Request location permissions from the user
 * @returns {Promise<boolean>} True if permission granted
 */
const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current location from device
 * @returns {Promise<object|null>} Location object or null if unavailable
 */
const getCurrentLocation = async () => {
  let startTime = performance.now();
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      console.log('Location permission not granted');
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    let endTime = performance.now();
    console.log('getCurrentLocation', endTime - startTime, 'ms');
    
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Save location to AsyncStorage
 * @param {object} location Location object to save
 */
const saveLocationToStorage = async (location) => {
  if (!location) return;
  
  try {
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    await AsyncStorage.setItem(LOCATION_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving location to storage:', error);
  }
};

/**
 * Get location from AsyncStorage
 * @returns {Promise<object|null>} Location object or null
 */
const getLocationFromStorage = async () => {
  try {
    const locationJson = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    
    if (!locationJson) {
      return null;
    }
    
    return JSON.parse(locationJson);
  } catch (error) {
    console.error('Error retrieving location from storage:', error);
    return null;
  }
};

/**
 * Check if stored location is fresh (less than maxAgeMinutes old)
 * @param {number} maxAgeMinutes Maximum age in minutes
 * @returns {Promise<boolean>} True if location is fresh
 */
const isStoredLocationFresh = async (maxAgeMinutes = 5) => {
  try {
    const timestampStr = await AsyncStorage.getItem(LOCATION_TIMESTAMP_KEY);
    
    if (!timestampStr) {
      return false;
    }
    
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;
    
    return now - timestamp < maxAgeMs;
  } catch (error) {
    console.error('Error checking location freshness:', error);
    return false;
  }
};

/**
 * Get user location, with storage caching
 * Will get from storage if available and fresh,
 * otherwise will fetch new location and save it
 * @param {number} maxAgeMinutes Maximum age in minutes for stored location
 * @returns {Promise<object>} Region object for MapView
 */
const getUserLocation = async (maxAgeMinutes = 5) => {
  try {
    // Check if we have a fresh location in storage
    const isFresh = await isStoredLocationFresh(maxAgeMinutes);
    
    if (isFresh) {
      const storedLocation = await getLocationFromStorage();
      
      if (storedLocation && storedLocation.coords) {
        return {
          latitude: storedLocation.coords.latitude,
          longitude: storedLocation.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        };
      }
    }
    
    // Get fresh location
    const currentLocation = await getCurrentLocation();
    
    if (currentLocation && currentLocation.coords) {
      // Save to storage for future use
      await saveLocationToStorage(currentLocation);
      
      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
      };
    }
    
    // Fallback to default region
    return DEFAULT_REGION;
  } catch (error) {
    console.error('Error in getUserLocation:', error);
    return DEFAULT_REGION;
  }
};

/**
 * Start periodic location updates
 * @param {number} intervalMinutes Minutes between updates
 * @returns {number} Interval ID for cleanup
 */
const startLocationUpdates = (intervalMinutes = 1) => {
  // Get initial location and save it
  getCurrentLocation().then(location => {
    if (location) {
      saveLocationToStorage(location);
    }
  });
  
  // Set up interval for periodic updates
  const intervalId = setInterval(async () => {
    const location = await getCurrentLocation();
    if (location) {
      saveLocationToStorage(location);
    }
  }, intervalMinutes * 60 * 1000);
  
  return intervalId;
};


const isDifferentRegion = (region1, region2) => {
    const delta1 = Math.abs(region1.latitude - region2.latitude);
    const delta2 = Math.abs(region1.longitude - region2.longitude);
    const delta3 = Math.abs(region1.latitudeDelta - region2.latitudeDelta);
    const delta4 = Math.abs(region1.longitudeDelta - region2.longitudeDelta);
    return delta1 > 0.001 || delta2 > 0.001 || delta3 > 0.001 || delta4 > 0.001;
};

/**
 * Stop location updates
 * @param {number} intervalId Interval ID from startLocationUpdates
 */
const stopLocationUpdates = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

export{
  getCurrentLocation,
  saveLocationToStorage,
  getLocationFromStorage,
  startLocationUpdates,
  stopLocationUpdates,
  isDifferentRegion,
};

export default getUserLocation;