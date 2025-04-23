import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const getStyles = (darkMode) => {

  const theme = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    border: darkMode ? COLORS.grey700 : COLORS.grey200,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    subText: darkMode ? COLORS.grey300 : COLORS.grey600,
    placeholder: darkMode ? COLORS.grey300 : COLORS.grey500,
    inputBackground: darkMode ? COLORS.grey800 : COLORS.white,
    buttonBackground: darkMode ? COLORS.primaryLight : COLORS.primaryDark,
    buttonText: darkMode ? COLORS.textDark : COLORS.textLight,
    buttonDisabled: darkMode ? COLORS.grey600 : COLORS.grey400,
    link: darkMode ? COLORS.white : COLORS.black,
    shadow: darkMode ? COLORS.grey800 : COLORS.grey300,
  };

  return StyleSheet.create({
    flexContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    divider: {
      height: 1,
      width: "40%",
      marginVertical: 10,
      backgroundColor: theme.border,
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
      color: theme.text,
    },
    formContainer: {
      width: "100%",
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      color: theme.text,
    },
    subheading: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 24,
      color: theme.subText,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 15,
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      color: theme.text,
    },
    continueButton: {
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      backgroundColor: theme.buttonBackground,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.buttonText,
    },
    orText: {
      textAlign: "center",
      marginVertical: 15,
      color: theme.subText,
    },
    googleButton: {
      flexDirection: "row",
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.grey100,
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
      color: COLORS.black,
    },
    termsText: {
      fontSize: 12,
      textAlign: "center",
      color: theme.subText,
    },
    link: {
      fontWeight: "bold",
      color: theme.link,
    },
    bottomBar: {
      height: 5,
      width: 40,
      backgroundColor: COLORS.black,
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
    titleLogin: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 40,
      marginBottom: 30,
      color: theme.text,
    },
    statusBar: {
      backgroundColor: theme.background,
      barStyle: darkMode ? "light-content" : "dark-content",
    },
    placeholderText: {
      color: theme.placeholder,
    },
    backButton: {
      padding: 8,
    },
    backIcon: {
      color: theme.text,
    },
    disabledInput: {
      backgroundColor: COLORS.grey100,
      color: darkMode ? COLORS.grey400 : COLORS.grey600,
    },
    passwordInput: {
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      color: theme.text,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
  });
};

export default getStyles;
