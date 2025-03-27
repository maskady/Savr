import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import MainScreen from "../screens/MainScreen";
import ErrorScreen from "../screens/ErrorScreen";
import DashboardScreen from "../screens/DashboardScreen";

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs: Home + Dashboard
function HomeTabs() {
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Hide header for each tab screen
        headerShown: false,
        // Customize tab bar icons
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Dashboard") {
            iconName = "stats-chart";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Optional tab bar styling
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

// Stack that wraps the bottom tabs + Error screen
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeTabs"
    >
      {/* Our bottom tabs */}
      <Stack.Screen name="HomeTabs" component={HomeTabs} />

      {/* Any other screens that should sit on top of tabs */}
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;