import React, { useState, useEffect, useContext } from "react";
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
import { useRoute, useNavigation } from '@react-navigation/native';
import storeToken from "../utils/token";
import { ArrowLeft } from "lucide-react-native";
import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";
import loginUser from "../utils/authApi";
import getStyles from "../styles/AuthStyles";
import { useTranslation } from 'react-i18next';
import AuthContext from "../contexts/AuthContext";
import SettingsContext from "../contexts/SettingsContext";

const LoginScreen = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const route = useRoute();
  const { email } = route.params;
  const inputAccessoryLoginPassword = "inputAccessoryLoginPassword";
  const navigation = useNavigation();
  const {login} = useContext(AuthContext);

  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));

  useEffect(() => {
    setStyles(getStyles(darkMode));
  }, [darkMode]);

  const handleSignin = async () => {
    if (email === "" || password === "") {
      alert("Please enter your email address and password");
      return;
    }
    
    try {
      const { response, data } = await loginUser(email, password);
      if (response.ok) {
        console.log("User logged in successfully");
        storeToken(data.data.token);
        login();
        navigation.navigate("App");
      } else {
        if (response.status === 401) {
          alert("Incorrect username or password");
        }
        console.error(data);
      }
    } catch (error) {
      console.error(error);
      navigation.navigate("App", { screen: "Error" });
    }
  };

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
                  {t("login.title")}
                </Text>
                <View style={styles.lineDivider} />

                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                />

                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t("common.passwordPlaceholder")}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={styles.placeholderText.color}
                  autoCapitalize="none"
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryLoginPassword : undefined}
                  returnKeyType="done"
                  onSubmitEditing={handleSignin}
                />

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleSignin}
                >
                  <Text style={styles.continueButtonText}>
                    {t("login.loginButton")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryLoginPassword} />}
    </SafeAreaView>
  );
};

export default LoginScreen;