import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Navigators
import HomeTabs from "./HomeTabs";

// Screens
import ErrorScreen from "../screens/ErrorScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ShopScreen from "../screens/ShopScreen";
import CompanyListScreen from "../screens/CompanyListScreen";
import CardPaymentScreen from "../screens/CardPaymentScreen";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeTabs">
      {/* Initial route for the app stack is HomeTabs */}
      <Stack.Screen name="HomeTabs" component={HomeTabs} />

      {/* We don't have Main Screen, My Shop, ... and other screen accessible via tabs to be clear that HomeTabs is the root */}

      {/* Other screens */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="CompanyList" component={CompanyListScreen} />
      <Stack.Screen name="CardPayment" component={CardPaymentScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
