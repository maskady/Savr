import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "../screens/MainScreen";
import ErrorScreen from "../screens/ErrorScreen";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
