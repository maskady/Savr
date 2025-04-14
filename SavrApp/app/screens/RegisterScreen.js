import React, { useState, useRef, useEffect } from "react";
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
  Appearance,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { storeToken } from "../utils/token";

import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";
import { registerUser } from "../utils/authApi";

import { useTranslation } from 'react-i18next';

import getStyles from "../styles//AuthStyles";

const RegisterScreen = () => {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const [styles, setStyles] = useState(getStyles());
  
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
        navigation.navigate("App");
      } else {
        console.error(data);
        throw new Error("User registration failed");
      }
    } catch (error) {
      console.error(error);
      navigation.navigate("App", { screen: "Error" });
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());  
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.content}>
              {Platform.OS === "ios" && (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <ArrowLeft size={24} color={styles.backIcon.color} />
                </TouchableOpacity>
              )}  

              <Text style={styles.title}>
                {t("appName")}
              </Text>

              <View style={styles.formContainer}>
                <Text style={styles.heading}>
                  {t("register.title")}
                </Text>
                <Text style={styles.subheading}>
                  {t("register.subtitle")}
                </Text>

                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                />

                <TextInput
                  ref={firstNameRef}
                  style={styles.input}
                  placeholderTextColor={styles.placeholderText.color}
                  placeholder={t("register.firstNamePlaceholder")}
                  value={firstName}
                  onChangeText={setFirstName}
                  onSubmitEditing={() => lastNameRef.current.focus()}
                  returnKeyType="next"
                  autoCapitalize="words"
                  submitBehavior="submit" 
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterFirstName : undefined}
                />

                <TextInput
                  ref={lastNameRef}
                  style={styles.input}
                  placeholder={t("register.lastNamePlaceholder")}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  placeholderTextColor={styles.placeholderText.color}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current.focus()} 
                  submitBehavior="submit" 
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterLastName : undefined}
                />

                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t("register.createPasswordPlaceholder")}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={styles.placeholderText.color}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onSubmitEditing={() => confirmPasswordRef.current.focus()} 
                  submitBehavior="submit"
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterPassword : undefined}
                />

                <TextInput
                  ref={confirmPasswordRef}
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor={styles.placeholderText.color}
                  returnKeyType="done"
                  autoCapitalize="none"
                  onSubmitEditing={handleSignup}
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryRegisterConfirmPassword : undefined}
                />

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleSignup}
                >
                  <Text style={styles.continueButtonText}>
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
