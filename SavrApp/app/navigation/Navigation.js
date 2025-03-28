import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import ErrorScreen from "../screens/ErrorScreen";

const RootStack = createStackNavigator();

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          <RootStack.Screen name="Auth">
            {(props) => <AuthStack {...props} setIsAuthenticated={setIsAuthenticated} />}
          </RootStack.Screen>
        )}
        <RootStack.Screen name="Error" component={ErrorScreen} />
      </RootStack.Navigator>
  );
};

export default Navigation;
