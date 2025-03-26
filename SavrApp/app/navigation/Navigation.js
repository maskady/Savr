import React, { useState } from "react";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    isAuthenticated ? <AppStack /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />
  );
};

export default Navigation;
