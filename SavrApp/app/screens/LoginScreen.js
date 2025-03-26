import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Appearance,
} from "react-native";
import { useRoute,  useNavigation } from '@react-navigation/native';
import { storeToken } from "../utils/token";

const LoginScreen = ({setIsAuthenticated}) => {
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState(Appearance.getColorScheme()); 
  const route = useRoute();
  const { email } = route.params;

  console.log("Email:", email);

  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      console.log("Theme changed:", colorScheme);
      if (colorScheme) {
        setTheme(colorScheme); 
      }
    };

    const subscription = Appearance.addChangeListener(handleThemeChange);

    return () => {
      subscription.remove(); 
    };
  }, []); 

  const navigation = useNavigation();

  const handleSignin = async () => {
    if (email === "" || password === "") {
      alert("Please enter your email address and password");
      return;
    }
    try{
      const response = await fetch("https://www.sevr.polaris.marek-mraz.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("User logged in successfully");
        // TODO: Remove comment when API is ready
        // storeToken(data.token);
        setIsAuthenticated(true);
      } else {
        console.error(data);
        // navigation.navigate("Error");
      }
    }
    catch(error){
      console.error(error);
      // navigation.navigate("Error");
    }
  }

  const isDarkMode = theme === "dark";
  //console.log("Current theme:", theme); 

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "white" },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#333" : "white"}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>
          Savr
        </Text>
        

        <View style={styles.formContainer}>
          <Text
            style={[styles.heading, { color: isDarkMode ? "white" : "black" }]}
          >
            Enter your master password
          </Text>
          <Text style={styles.divider}/>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: "#f1f1f1",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            value={email}
            editable={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: isDarkMode ? "#333" : "white",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            placeholder="Master Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: isDarkMode ? "#6200ea" : "black" },
            ]}
            onPress={handleSignin}
          >
            <Text
              style={[styles.continueButtonText, { color: "white" }]}
            >
              Sign in 
            </Text>
          </TouchableOpacity>
        </View>
        <View />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    height: 1,
    width: "40%",
    marginVertical: 10,
  },
  lineDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 15,
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
  },
  link: {
    color: "#000",
    textDecorationLine: "underline",
  },
  bottomBar: {
    height: 5,
    width: 40,
    backgroundColor: "#000",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
