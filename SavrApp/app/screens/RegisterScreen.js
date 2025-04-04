import React, { useState, useRef, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
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
import { registerUser } from "../utils/authApi";

import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import { SettingsContext } from "../contexts/SettingsContext";

import styles from "../styles/AuthStyles";

const RegisterScreen = () => {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { darkMode } = useContext(SettingsContext);
  const { login } = useContext(AuthContext);
  const route = useRoute();
  const { email } = route.params;
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const inputAccessoryRegisterFirstName = "inputAccessoryRegisterFirstName";
  const inputAccessoryRegisterLastName = "inputAccessoryRegisterLastName";
  const inputAccessoryRegisterPassword = "inputAccessoryRegisterPassword";
  const inputAccessoryRegisterConfirmPassword = "inputAccessoryRegisterConfirmPassword";

  const navigation = useNavigation();
  
  const handleSignup = async () => {

    if (email === "" || firstName === "" || lastName == "" || password === "" || confirmPassword === "") {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 8 || password === password.toLowerCase() || password === password.toUpperCase() || !/\d/.test(password)) {
      alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number");
      return;
    }

    try {
      console.log("Registering user with email:", email);

      const { response, data } = await registerUser(email, password, firstName, lastName);

      if (response.ok) {
        console.log("User created successfully");
        storeToken(data.data.token);
        login();
      } else {
        console.error(data);
        navigation.navigate("Error");
      }
    } catch (error) {
      console.error(error);
      navigation.navigate("Error");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.flexContainer,
        { backgroundColor: darkMode ? "#121212" : "white" },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#333" : "white"}
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
            <ArrowLeft size={24} color={darkMode ? "white" : "black"} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: darkMode ? "white" : "black" }]}>
          {t("appName")}
        </Text>

        <View style={styles.formContainer}>
          <Text
            style={[styles.heading, { color: darkMode ? "white" : "black" }]}
          >
            {t("register.title")}
          </Text>
          <Text
            style={[
              styles.subheading,
              { color: darkMode ? "#bbb" : "#666" },
            ]}
          >
            {t("register.subtitle")}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "grey" : "#f1f1f1",
                color: darkMode ? "white" : "black",
              },
            ]}
            value={email}
            editable={false}
          />

          <TextInput
            ref={firstNameRef}
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              },
            ]}
            placeholder={t("register.firstNamePlaceholder")}
            value={firstName}
            onChangeText={setFirstName}
            onSubmitEditing={() => lastNameRef.current.focus()}
            returnKeyType="next"
            autoCapitalize="words"
            submitBehavior="submit" 
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterFirstName : undefined}
          />

          <TextInput
            ref={lastNameRef}
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              },
            ]}
            placeholder={t("register.lastNamePlaceholder")}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()} 
            submitBehavior="submit" 
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterLastName : undefined}
          />

          <TextInput
            ref={passwordRef}
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              },
            ]}
            placeholder={t("register.createPasswordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            returnKeyType="next"
            autoCapitalize="none"
            onSubmitEditing={() => confirmPasswordRef.current.focus()} 
            submitBehavior="submit"
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterPassword : undefined}
          />

          <TextInput
            ref={confirmPasswordRef}
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              },
            ]}
            placeholder={t("register.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            returnKeyType="done"
            autoCapitalize="none"
            onSubmitEditing={handleSignup}
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterConfirmPassword : undefined}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: darkMode ? "#6200ea" : "black" },
            ]}
            onPress={handleSignup}
          >
            <Text
              style={[styles.continueButtonText, { color: "white" }]}
            >
              {t("register.registerButton")}
            </Text>
          </TouchableOpacity>
        </View>
        <View />
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryRegisterFirstName} />}
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryRegisterLastName} />}
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryRegisterPassword} />}
    {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryRegisterConfirmPassword} />}
    </SafeAreaView>
  );
};

export default RegisterScreen;
