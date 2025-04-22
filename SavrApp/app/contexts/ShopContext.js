// ShopContext.js
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { getShops } from '../utils/api';
import { businessCategories } from '../constants/businessCategories';
import { throttle } from 'lodash';
import { request } from '../utils/request';
import haversine from 'haversine-distance';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [lastFetchedRegion, setLastFetchedRegion] = useState(null);
  const [myShop, setMyShop] = useState([]);

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
    const r = Math.min(Math.max(verticalDistanceKm, horizontalDistanceKm) / 2, MAX_RADIUS); 
    return r;
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
      fetchShopsThrottled(currentRegion, computedCurrentRadius * 4); // multiply by 4 to get a larger radius for smoother UX
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

  const fetchMyShop = async () => {
    try {
      const { response, data } = await request('/shop', 'GET', null, { onlyMyShops: true });
      if (response.ok) {
        setMyShop(data.data[0]);
        console.log("Shop data:", data.data[0]);
      } else {
        console.error("Failed to fetch shop:", response.statusText);
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  };

  // State for filtered shops and updater
  const [filteredShops, setFilteredShops] = useState([]);
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Update filteredShops based on search query and activeCategories
  useEffect(() => {
    // Start with all shops
    let filtered = shops;

    // Apply search filter if query exists
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((shop) =>
        shop.name.toLowerCase().includes(searchQuery) ||
        shop.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter, including "other" for uncategorized shops
    filtered = filtered.filter((shop) =>
      activeCategories.includes(shop.primaryCategory) ||
      (activeCategories.includes('other') && !shop.primaryCategory)
    );

    setFilteredShops(filtered);
  }, [shops, activeCategories, searchQuery]);

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
      updateShopInContext,
      setFilteredShops,
      searchQuery,
      setSearchQuery,
      fetchMyShop,
      myShop,
    }}>
      {children}
    </ShopContext.Provider>
  );
};