import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
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
import { useRoute,  useNavigation } from '@react-navigation/native';
import { storeToken } from "../utils/token";
import { ArrowLeft } from "lucide-react-native";
import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";
import { loginUser } from "../utils/authApi";
import { AuthContext } from "../contexts/AuthContext"; 
import { SettingsContext } from "../contexts/SettingsContext";
import styles from "../styles/AuthStyles";
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const route = useRoute();
  
  const { email } = route.params;
  const inputAccessoryLoginPassword = "inputAccessoryLoginPassword";
  
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(SettingsContext);

  const navigation = useNavigation();

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
      } else {
        if (response.status === 401) {
          alert("Incorrect username or password");
        }
        console.error(data);
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
        <Text style={[styles.titleLogin, { color: darkMode ? "white" : "black" }]}>
          {t("appName")}
        </Text>
        

        <View style={styles.formContainer}>
          <Text
            style={[styles.heading, { color: darkMode ? "white" : "black" }]}
          >
            {t("login.title")}
          </Text>
          <Text style={styles.divider}/>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: "#f1f1f1",
                color: darkMode ? "white" : "black",
              },
            ]}
            value={email}
            editable={false}
          />

          <TextInput
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? "#333" : "white",
                color: darkMode ? "white" : "black",
              },
            ]}
            placeholder={t("common.passwordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            autoCapitalize="none"
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryLoginPassword : undefined}
            returnKeyType="done"
            onSubmitEditing={handleSignin}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: darkMode ? "#6200ea" : "black" },
            ]}
            onPress={handleSignin}
          >
            <Text
              style={[styles.continueButtonText, { color: "white" }]}
            >
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
