import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const RootStack = createStackNavigator();

const Navigation = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
      <RootStack.Screen name="Auth" component={AuthStack} />
      <RootStack.Screen name="App" component={AppStack} />
    </RootStack.Navigator>
  );
};

export default Navigation;
