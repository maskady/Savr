import React, { useState, useEffect, useContext } from "react";
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
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";
import { checkUserExists } from "../utils/api";
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { SettingsContext } from "../contexts/SettingsContext";

const WelcomeScreen = () => {
  const [email, setEmail] = useState("");
  const { darkMode } = useContext(SettingsContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const inputAccessoryWelcomeEmail = "inputAccessoryWelcomeEmail";

  const handleContinue = async () => {
    // First validation
    if (email === "") {
      alert("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address");
      return;
    }
  
    try {
      const { response, data } = await checkUserExists(email);
  
      if (response.status != 500) {  
        if (response.status === 200) {
          console.log("User exists, navigating to Login screen");
          navigation.navigate("Login", { email });
        } else {
          console.log("User does not exist, navigating to Register screen");
          navigation.navigate("Register", { email });
        }
      } else {
        console.error("Error in WelcomeScreen:", data);
        navigation.navigate("Error");
      }
  
    } catch (error) {
      console.error("Error in WelcomeScreen:", error);
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
        { backgroundColor: darkMode ? "#121212" : Colors.White },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? Colors.Grey : Colors.White}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: darkMode ? "white" : "black" }]}>
          {t('appName')}
        </Text>

        <View style={styles.formContainer}>
          <Text style={[styles.heading, { color: darkMode ? Colors.White : Colors.Black }]}>
            {t('welcome.title')}
          </Text>
          <Text
            style={[
              styles.subheading,
              { color: darkMode ? "#bbb" : "#666" },
            ]}
          >
            {t('welcome.subtitle')}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: darkMode ? "#444" : "#ddd",
                backgroundColor: darkMode ? Colors.Grey : Colors.White,
                color: darkMode ? Colors.White : Colors.Black,
              },
            ]}
            placeholder={t('common.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={darkMode ? "#bbb" : "#666"}
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryWelcomeEmail : undefined}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: darkMode ? "#6200ea" : Colors.Black },
            ]}
            onPress={handleContinue}   
          >
            <Text
              style={[
                styles.continueButtonText,
                { color: Colors.White },
              ]}
            >
              {t('common.continueButton')}
            </Text>
          </TouchableOpacity>

          <View style={styles.lineDivider}>
            <View
              style={[
                styles.divider,
                { backgroundColor: darkMode ? "#666" : "#ccc" },
              ]}
            />
            <Text
              style={[
                styles.orText,
                { color: darkMode ? "#bbb" : "#666" },
              ]}
            >
              {t('common.orText')}
            </Text>
            <View
              style={[
                styles.divider,
                { backgroundColor: darkMode ? "#666" : "#ccc" },
              ]}
            />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("/Users/tomibozak/Projects/Savr/SavrApp/assets/images/google-logo.png")}
              style={styles.googleIcon}
            />
            <Text
              style={[
                styles.googleButtonText,
                { color: Colors.Black },
              ]}
            >
              {t('welcome.googleButton')}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: darkMode ? "#bbb" : "#666" }]}>
            <Trans
              i18nKey="common.terms"
              components={[
                <Text style={[styles.link, { color: darkMode ? "#fff" : "#000" }]} />,
                <Text style={[styles.link, { color: darkMode ? "#fff" : "#000" }]} />,
              ]}
            />
          </Text>
          
        </View>
        <View />
      </View>
      {Platform.OS === "ios" && <IOSKeyboardToolBar inputAccessoryViewID={inputAccessoryWelcomeEmail} />}
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
