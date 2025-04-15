import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Navigators
import HomeTabs from "./HomeTabs";

// Screens
import ErrorScreen from "../screens/ErrorScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ShopScreen from "../screens/ShopScreen";
import CompanyListScreen from "../screens/CompanyListScreen";
import CheckoutScreen from "../screens/CheckoutScreen";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTabs">
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="CompanyList" component={CompanyListScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
