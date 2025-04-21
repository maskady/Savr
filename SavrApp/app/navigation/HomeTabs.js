import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SettingsContext } from "../contexts/SettingsContext";
import { useNavigation } from "@react-navigation/native";

// Screens
import MainScreen from "../screens/MainScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ShopScreen from "../screens/ShopScreen";

import { CartContext } from "../contexts/CheckoutContext";
import { AuthContext } from "../contexts/AuthContext";
import CompanyListScreen from "../screens/CompanyListScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();

  const { addToCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  console.log("User roleId:", user?.roleId);

  useEffect(() => {
    const state = navigation.getState();
    console.log("All route names:", state.routeNames);
  }, [navigation]);

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
          else if (route.name === "Profile") iconName = "person";
          else if (route.name === "Checkout") iconName = "cart";
          else if (route.name === "My Shop") iconName = "storefront";
          else if (route.name === "My Company") iconName = "business";


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
      { user?.roleId === 'shop' ? (
        <Tab.Screen name="My Shop" component={ShopScreen} initialParams={{shop: dummyShop}} />
      )
      : user?.roleId === 'company' ? (
        <Tab.Screen name="My Company" component={CompanyListScreen} initialParams={{from: 'home'}} />
      )
      : null
      }

      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;