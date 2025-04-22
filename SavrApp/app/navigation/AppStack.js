import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Navigators
import HomeTabs from "./HomeTabs";

// Screens
import ErrorScreen from "../screens/ErrorScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ShopScreen from "../screens/ShopScreen";
import CompanyListScreen from "../screens/CompanyListScreen";
import PostProductScreen from "../screens/PostProductScreen";
import CompanyCreationScreen from "../screens/CompanyCreationScreen";
import CompanyUpdateScreen from "../screens/CompanyUpdateScreen";
import ShopListScreen from "../screens/ShopListScreen";
import ShopCreationScreen from "../screens/ShopCreationScreen";
import ShopUpdateScreen from "../screens/ShopUpdateScreen";
import OrdersScreen from "../screens/OrdersScreens";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

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
      <Stack.Screen name="CompanyCreation" component={CompanyCreationScreen} />
      <Stack.Screen name="CompanyUpdate" component={CompanyUpdateScreen} />
      <Stack.Screen name="ShopList" component={ShopListScreen} />
      <Stack.Screen name="ShopCreation" component={ShopCreationScreen} />
      <Stack.Screen name="ShopUpdate" component={ShopUpdateScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
      <Stack.Screen name="PostProduct" component={PostProductScreen} />

    </Stack.Navigator>
  );
};

export default AppStack;
