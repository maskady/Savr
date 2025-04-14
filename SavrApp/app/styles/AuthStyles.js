import { StyleSheet, Appearance } from "react-native";

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  return StyleSheet.create({
    flexContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "white",
    },
    divider: {
      height: 1,
      width: "40%",
      marginVertical: 10,
      backgroundColor: isDarkMode ? "#666" : "#ccc",
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
      color: isDarkMode ? "white" : "black",
    },
    formContainer: {
      width: "100%",
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      color: isDarkMode ? "white" : "black",
    },
    subheading: {
      fontSize: 14,
      textAlign: "center",
      marginBottom: 24,
      color: isDarkMode ? "#bbb" : "#666",
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 15,
      borderColor: isDarkMode ? "#444" : "#ddd",
      backgroundColor: isDarkMode ? "#333" : "white",
      color: isDarkMode ? "white" : "black",
    },
    continueButton: {
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      backgroundColor: isDarkMode ? "white" : "black",
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: isDarkMode ? "black" : "white",
    },
    orText: {
      textAlign: "center",
      marginVertical: 15,
      color: isDarkMode ? "#bbb" : "#666",
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
      color: "black",
    },
    termsText: {
      fontSize: 12,
      textAlign: "center",
      color: isDarkMode ? "#bbb" : "#666",
    },
    link: {
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
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
    titleLogin: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 40,
      marginBottom: 30,
    },
    statusBar: {
      backgroundColor: isDarkMode ? "#121212" : "white",
      barStyle: isDarkMode ? "light-content" : "dark-content",
    },
    placeholderText: {
      color: isDarkMode ? "#bbb" : "#666",
    },
    backButton: {
      padding: 8,
    },
    backIcon: {
      color: isDarkMode ? "white" : "black",
    },
    disabledInput: {
      backgroundColor: "#f1f1f1",
      color: isDarkMode ? "#aaa" : "#666",
    },
    passwordInput: {
      borderColor: isDarkMode ? "#444" : "#ddd",
      backgroundColor: isDarkMode ? "#333" : "white",
      color: isDarkMode ? "white" : "black",
    },
    loginButton: {
      backgroundColor: isDarkMode ? "#6200ea" : "black",
    },
    loginButtonText: {
      color: "white",
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