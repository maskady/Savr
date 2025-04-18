import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SettingsContext } from "../contexts/SettingsContext";
import { useNavigation } from "@react-navigation/native";

// Screens
import MainScreen from "../screens/MainScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ShopScreen from "../screens/ShopScreen";

import { CartContext } from "../contexts/CheckoutContext";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();

  console.log('SettingsContext:', SettingsContext);
  console.log('CartContext:', CartContext);


  const { addToCart, clearCart } = useContext(CartContext);

  // For debugging purposes, log all route names
  useEffect(() => {
    const state = navigation.getState();
    console.log("All route names:", state.routeNames);
    // If you need nested routes, inspect state.routes, e.g.:
    // state.routes.forEach(r => console.log(r.name, r.state?.routeNames));

    // Add some product to the cart with cartContext
    clearCart(); // Clear the cart first
    addToCart(dummyItems[0]);
    addToCart(dummyItems[1]);
    addToCart(dummyItems[1]); 
  }, [navigation]);

  const dummyItems = [ // TODO: Replace with actual data
    {
      id: 1,
      name: "Surprise Sandwich",
      originalPrice: 15.90,
      discountPrice: 5.50,
      image: "https://placeholder.com/food",
      shopName: "La Boulangerie",
      pickupTime: "18:00 - 19:00",
    },
    {
      id: 2,
      name: "Surprise Wrap",
      originalPrice: 11.90,
      discountPrice: 3.50,
      image: "https://placeholder.com/food",
      shopName: "La Boulangerie",
      pickupTime: "18:00 - 19:00",
    }
  ];

  const dummyShop = {
    "id": 10,
    "name": "Kahvila konditoria Aino",
    "description": "Best coffee in town",
    "address": "Merikoskenkatu 9",
    "postalCode": "90500",
    "city": "Oulu",
    "country": "Finland",
    "phone": "+385911234567",
    "email": "kahvila@example.com",
    "companyId": 9,
    "latitude": 65.0254999,
    "longitude": 25.4696293,
    "dtcreated": "2025-03-30T18:12:38.701Z",
    "dtupdated": "2025-03-30T18:12:38.701Z",
    "dtdeleted": null,
    "rating": 5,
    "ratings": 5,
    "dtremoved": null,
    "primaryCategory": "florist",
    "images": [
      {
        "alt": "Uploaded Image",
        "url": "/public/images/image-1744310284147-4198645356823.webp",
        "type": "uploaded"
      },
      {
        "alt": "Uploaded Image",
        "url": "/public/images/image-1744310323270-0962859202703.webp",
        "type": "uploaded"
      }
    ],
    "currencyId": "eur",
    "categories": []
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Dashboard") iconName = "stats-chart";
          else if (route.name === "Checkout") iconName = "cart";
          else if (route.name === "My Shop") iconName = "storefront";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: darkMode ? "#fff" : "gray",
        tabBarStyle: {
          backgroundColor: darkMode ? "#333" : "#fff",
        },
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="My Shop" component={ShopScreen} initialParams={{shop: dummyShop}} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;