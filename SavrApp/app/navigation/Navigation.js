import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import ErrorScreen from "../screens/ErrorScreen";
import { AuthContext } from "../contexts/AuthContext";
import SettingsScreen from "../screens/SettingsScreen";


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
        <RootStack.Screen name="Settings" component={SettingsScreen} />
      </RootStack.Navigator>
  );
};

export default Navigation;
