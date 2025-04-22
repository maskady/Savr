// TODO: Refactor styles
import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IOSKeyboardToolBar from "../components/IOSKeyboardToolBar";
import { checkUserExists } from "../utils/authApi";
import { useTranslation, Trans } from 'react-i18next';
import getStyles from "../styles/AuthStyles";
import { SettingsContext } from "../contexts/SettingsContext";

const WelcomeScreen = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));
  
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
          navigation.navigate("Auth", { screen: "Login", params: { email } });
        } else {
          console.log("User does not exist, navigating to Register screen");
          navigation.navigate("Auth", { screen: "Register", params: { email } });
        }
      } else {
        throw new Error("Server error: Unable to check user existence");
      }
  
    } catch (error) {
      console.error("Error in WelcomeScreen:", error);
      navigation.navigate("App", { screen: "Error" });
    }
  };

  useEffect(() => {
    setStyles(getStyles(darkMode));
  }, [darkMode]);

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('appName')}
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.heading}>
            {t('welcome.title')}
          </Text>
          <Text style={styles.subheading}>
            {t('welcome.subtitle')}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('common.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={styles.placeholderText.color}
            inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryWelcomeEmail : undefined}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}   
          >
            <Text style={styles.continueButtonText}>
              {t('common.continueButton')}
            </Text>
          </TouchableOpacity>

          <View style={styles.lineDivider}>
            <View style={styles.divider} />
            <Text style={styles.orText}>
              {t('common.orText')}
            </Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("assets/images/google-logo.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>
              {t('welcome.googleButton')}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            <Trans
              i18nKey="common.terms"
              components={[
                <Text style={styles.link} />,
                <Text style={styles.link} />,
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

export default WelcomeScreen;