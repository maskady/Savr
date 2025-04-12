// ShopContext.js
import React, { createContext, useState, useCallback } from 'react';
import { getShops } from '../utils/api';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [activeCategories, setActiveCategories] = useState(Object.keys(businessCategories));

  // Define a function to fetch shops. You may add region/radius parameters as needed.
  const fetchShops = useCallback(async (region, radius) => {
    try {
      const data = await getShops(region.latitude, region.longitude, radius);
      setShops(data);
      // Combine with allShops or perform filtering, as needed:
      const combinedData = [...allShops, ...data].filter((shop, index, self) =>
        index === self.findIndex((t) => t.id === shop.id)
      );
      setAllShops(combinedData);
      // Update filteredShops based on your filtering logic.
      setFilteredShops(combinedData);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  }, [allShops]);

  return (
    <ShopContext.Provider value={{
      shops,
      allShops,
      filteredShops,
      fetchShops,
      setShops,
      setAllShops,
      setFilteredShops,
    }}>
      {children}
    </ShopContext.Provider>
  );
};