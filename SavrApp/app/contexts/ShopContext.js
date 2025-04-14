// ShopContext.js
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { getShops } from '../utils/api';
import { businessCategories } from '../constants/businessCategories';
import { throttle } from 'lodash';
import haversine from 'haversine-distance';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);

  useEffect(() => {
    const keys = Object.keys(businessCategories);
    if (keys.length > 0) {
      setActiveCategories(keys);
    }
  }, [businessCategories]);


  const MAX_RADIUS = 100; // Maximum radius in kilometers
  const THROTTLE_TIME = 100; // Throttle time in milliseconds

  const calculateRadius = (region) => {
    const { latitude, latitudeDelta, longitudeDelta } = region;
    const verticalDistanceKm = latitudeDelta * 111;
    const horizontalDistanceKm = longitudeDelta * 111 * Math.cos(latitude * (Math.PI / 180));
    return Math.min(Math.max(verticalDistanceKm, horizontalDistanceKm) / 2 * 4, MAX_RADIUS); // multiply by 4 to get a larger radius for smoother UX
  };

  const fetchShopsThrottled = useMemo(
    () =>
      throttle(async (region, radius) => {
        // Fetch new shops from API
        const data = await getShops(region.latitude, region.longitude, radius);
        setShops(data);
        
        // Use a functional update to merge new data with previous allShops without including it in dependencies.
        setAllShops((prevAllShops) => {
          const allData = [...prevAllShops, ...data].filter((shop, index, self) =>
            index === self.findIndex((t) => t.id === shop.id)
          );
          return allData;
        });

        // Update last fetched region
        setLastFetchedRegion(region);
      }, THROTTLE_TIME),
    [] // No dependency on allShops
  );

  const fetchShopsIfNeeded = (currentRegion) => {
    const computedCurrentRadius = calculateRadius(currentRegion);
    if (
      !lastFetchedRegion ||
      haversine(
        { latitude: currentRegion.latitude, longitude: currentRegion.longitude },
        { latitude: lastFetchedRegion.latitude, longitude: lastFetchedRegion.longitude }
      ) > (computedCurrentRadius * 1000) / 3
    ) {
      fetchShopsThrottled(currentRegion, computedCurrentRadius);
    }
  };

  // Update a single shop in the context (used when user edits a shop in the app).
  const updateShopInContext = (updatedShop) => {
    // Update shops array
    setShops(prevShops =>
      prevShops.map(shop => (shop.id === updatedShop.id ? updatedShop : shop))
    );

    // Update allShops array
    setAllShops(prevAllShops =>
      prevAllShops.map(shop => (shop.id === updatedShop.id ? updatedShop : shop))
    );
  };

  // Derive filteredShops from shops and activeCategories via useMemo.
  const filteredShops = useMemo(() => {
    const filtered = shops.filter((shop) => activeCategories.includes(shop.primaryCategory));
    if (activeCategories.includes('other')) {
      const otherShops = shops.filter((shop) => !shop.primaryCategory);
      return [...filtered, ...otherShops];
    }
    return filtered;
  }, [activeCategories, shops]);


  return (
    <ShopContext.Provider value={{
      shops,
      allShops,
      filteredShops,
      fetchShopsThrottled,
      activeCategories,
      setShops,
      setAllShops,
      fetchShopsIfNeeded,
      setActiveCategories,
      updateShopInContext
    }}>
      {children}
    </ShopContext.Provider>
  );
};