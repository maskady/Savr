import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Appearance,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { storeToken } from "../utils/token";
import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";

const RegisterScreen = ({setIsAuthenticated}) => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState(Appearance.getColorScheme()); 
  const route = useRoute();
  const { email } = route.params;
  const fullNameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const inputAccessoryViewID1 = "inputAccessoryViewID1";  
  const inputAccessoryViewID2 = "inputAccessoryViewID2"; 
  const inputAccessoryViewID3 = "inputAccessoryViewID3";  


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
  
  const handleSignup = async () => {
    if (email === "" || fullName === "" || password === "" || confirmPassword === "") {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://www.sevr.polaris.marek-mraz.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, "firstName": fullName.split(" ")[0], "lastName": fullName.split(" ")[1], password, confirmPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("User created successfully");
        // TODO: Remove the comment when the API is ready
        // storeToken(data.token);
        setIsAuthenticated(true);
      } else {
        console.error(data);
        // navigation.navigate("Error");
      }
    } catch (error) {
      console.error(error);
      // navigation.navigate("Error");
    }
  };

  const isDarkMode = theme === "dark";
  //console.log("Current theme:", theme); 
  console.log("Current OS:", Platform.OS);

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
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.content}>
        {Platform.OS === "ios" && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>
          Savr
        </Text>

        <View style={styles.formContainer}>
          <Text
            style={[styles.heading, { color: isDarkMode ? "white" : "black" }]}
          >
            Create an account
          </Text>
          <Text
            style={[
              styles.subheading,
              { color: isDarkMode ? "#bbb" : "#666" },
            ]}
          >
            Enter your full name and set up your master password
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: isDarkMode ? "grey" : "#f1f1f1",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            value={email}
            editable={false}
          />

          <TextInput
            ref={fullNameRef}
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: isDarkMode ? "#333" : "white",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()} 
            submitBehavior="submit" 
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID1 : undefined}
          />

          <TextInput
            ref={passwordRef}
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()} 
            submitBehavior="submit"
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID2 : undefined}
          />

          <TextInput
            ref={confirmPasswordRef}
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? "#444" : "#ddd",
                backgroundColor: isDarkMode ? "#333" : "white",
                color: isDarkMode ? "white" : "black",
              },
            ]}
            placeholder="Confirm Master Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID3 : undefined}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: isDarkMode ? "#6200ea" : "black" },
            ]}
            onPress={handleSignup}
          >
            <Text
              style={[styles.continueButtonText, { color: "white" }]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <View />
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryViewID1} />}
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryViewID2} />}
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryViewID3} />}
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

export default RegisterScreen;
