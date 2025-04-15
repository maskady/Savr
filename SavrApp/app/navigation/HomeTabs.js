import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SettingsContext } from "../contexts/SettingsContext";

// Screens
import MainScreen from "../screens/MainScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CheckoutScreen from "../screens/CheckoutScreen";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { darkMode } = useContext(SettingsContext);

  const items = [
    {
      id: 1,
      name: "Surprise Sandwich",
      originalPrice: 15.90,
      discountPrice: 5.50,
      image: "https://placeholder.com/food",
      shopName: "La Boulangerie",
      pickupTime: "18:00 - 19:00",
      quantity: 1
    },
    {
      id: 2,
      name: "Surprise Wrap",
      originalPrice: 11.90,
      discountPrice: 3.50,
      image: "https://placeholder.com/food",
      shopName: "La Boulangerie",
      pickupTime: "18:00 - 19:00",
      quantity: 2
    }
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Dashboard") iconName = "stats-chart";
          else if (route.name === "Checkout") iconName = "cart";

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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Checkout" component={CheckoutScreen} initialParams={{ items: items }} />
    </Tab.Navigator>
  );
};

export default HomeTabs;