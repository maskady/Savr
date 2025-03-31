import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
