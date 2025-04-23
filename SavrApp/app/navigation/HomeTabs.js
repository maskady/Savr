import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SettingsContext from "../contexts/SettingsContext";
import { useNavigation } from "@react-navigation/native";

// Screens
import MainScreen from "../screens/MainScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ShopScreen from "../screens/ShopScreen";

import AuthContext from "../contexts/AuthContext";
import ShopContext from "../contexts/ShopContext";
import CompanyListScreen from "../screens/CompanyListScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { darkMode } = useContext(SettingsContext);
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);
  const { fetchMyShop } = useContext(ShopContext);

  console.log("User roleId:", user?.roleId);

  useEffect(() => {
    const state = navigation.getState();
    console.log("All route names:", state.routeNames);
  
    if (user?.roleId === "shop") {
      fetchMyShop();
    }
  }, [user?.roleId]);

  

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
        <Tab.Screen name="My Shop" component={ShopScreen} initialParams={{myShop: true}} />
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