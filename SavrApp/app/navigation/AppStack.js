import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import MainScreen from "../screens/MainScreen";

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
      <Stack.Screen name="Home" component={MainScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
