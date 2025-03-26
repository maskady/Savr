import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = () => {
  const handlePress = () => {
    console.log("Bouton pressé !");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur mon app !</Text>
      <Button title="Appuie ici" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
