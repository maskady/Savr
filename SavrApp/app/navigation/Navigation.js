import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthContext from "../contexts/AuthContext";
import SettingsContext from "../contexts/SettingsContext";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const RootStack = createStackNavigator();

const Navigation = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [routeName, setRouteName] = useState(isLoggedIn ? "App" : "Auth");

  const { darkMode } = useContext(SettingsContext);
  
  useEffect(() => {
    console.log("Navigation: isLoggedIn:", isLoggedIn);
    setRouteName(isLoggedIn ? "App" : "Auth");
  }, [isLoggedIn]);

  console.log("Navigation: Initial route name:", routeName);

  return (
    <RootStack.Navigator
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: darkMode ? "#000" : "#fff" },
      }}
      initialRouteName={routeName}
      key={routeName} // key prop to force re-render on route change
    >
      <RootStack.Screen name="Auth" component={AuthStack} />
      <RootStack.Screen name="App" component={AppStack} />
    </RootStack.Navigator>
  );
};

export default Navigation;
