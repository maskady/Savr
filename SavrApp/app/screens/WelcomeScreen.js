import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Appearance,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState(Appearance.getColorScheme()); // Initialization with the current value

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

  const isDarkMode = theme === "dark";

  console.log("Current theme:", theme); 

  const navigation = useNavigation();

  const handleContinue = async () => {
    // First validation
    if (email === "") {
      alert("Please enter your email address");
      return;
    }
  
    try {
      // TODO: Implement real API call
      let response = {};
      if (email.length > 10) {
        response = {
          ok: true,
          data: {
            exists: true,
          },
        };
      } else {
        response = {
          ok: true,
          data: {
            exists: false,
          },
        };
      }

      const { data } = response; // Destructure 'data' from 'response'
  
      if (response.ok) {
        if (data.exists) {
          navigation.navigate("Login", { email });
        } else {
          navigation.navigate("Register", { email });
        }
      } else {
        console.error("Erreur dans la réponse de la requête :", data);
        navigation.navigate("Error");
      }
  
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      navigation.navigate("Error");
    }
  };

  const Colors = {
    Black: "black",
    White: "white",
    Grey: "#333",
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : Colors.White },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? Colors.Grey : Colors.White}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>
          Savr
        </Text>

        <View style={styles.formContainer}>
          <Text style={[styles.heading, { color: isDarkMode ? Colors.White : Colors.Black }]}>
            Create an account
          </Text>
          <Text
            style={[
              styles.subheading,
              { color: isDarkMode ? "#bbb" : "#666" },
            ]}
          >
            Enter your email to sign up for this app
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
                color: isDarkMode ? Colors.White : Colors.Black,
              },
            ]}
            placeholder="email@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: isDarkMode ? "#6200ea" : Colors.Black },
            ]}
            onPress={handleContinue}   
          >
            <Text
              style={[
                styles.continueButtonText,
                { color: Colors.White },
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>

          <View style={styles.lineDivider}>
            <View
              style={[
                styles.divider,
                { backgroundColor: isDarkMode ? "#666" : "#ccc" },
              ]}
            />
            <Text
              style={[
                styles.orText,
                { color: isDarkMode ? "#bbb" : "#666" },
              ]}
            >
              or
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: isDarkMode ? "#666" : "#ccc" },
              ]}
            />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
              }}
              style={styles.googleIcon}
            />
            <Text
              style={[
                styles.googleButtonText,
                { color: Colors.Black },
              ]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.termsText,
              { color: isDarkMode ? "#bbb" : "#666" },
            ]}
          >
            By clicking continue, you agree to our{" "}
            <Text style={[styles.link, {color: isDarkMode ? "#fff" : "#000"}]}>Terms of Service</Text> and{" "}
            <Text style={[styles.link, {color: isDarkMode ? "#fff" : "#000"}]}>Privacy Policy</Text>
          </Text>
          
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
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
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
  orText: {
    textAlign: "center",
    marginVertical: 15,
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
    fontWeight: "bold",
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

export default WelcomeScreen;
