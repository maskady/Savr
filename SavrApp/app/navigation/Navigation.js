import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import ErrorScreen from "../screens/ErrorScreen";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

const RootStack = createStackNavigator();

const Navigation = () => {

  const { isLoggedIn } = useContext(AuthContext);

  return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          <RootStack.Screen name="Auth">
            {(props) => <AuthStack {...props} />}
          </RootStack.Screen>
        )}
        <RootStack.Screen name="Error" component={ErrorScreen} />
      </RootStack.Navigator>
  );
};

export default Navigation;
