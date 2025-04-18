// styles.js
import { StyleSheet, Appearance } from "react-native";

const Colors = {
  Black: "#000000",
  White: "#FFFFFF",
  Grey: "#1E1E1E",
  lightGrey: "#888888",
  darkGrey: "#444444",
  classicGrey: "#555555",
  Red: "#FF3B30",
};

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
      padding: 20,
    },
    header:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 14,
      borderColor: isDarkMode ? Colors.darkGrey : "#ddd",
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    inputError: {
      borderColor: Colors.Red,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      color: Colors.Red,
      fontSize: 14,
      marginTop: 5,
    },
    submitButton: {
      backgroundColor: isDarkMode ? Colors.White : Colors.Black,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    submitButtonText: {
      color: isDarkMode ? Colors.Black : Colors.White,
      fontSize: 18,
      fontWeight: 'bold',
    },
    imagePickerButton: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? Colors.darkGrey : "#ddd",
      borderStyle: 'dashed',
    },
    imagePickerButtonText: {
      color: isDarkMode ? Colors.White : Colors.Black,
      fontSize: 16,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    imageItem: {
      width: 100,
      height: 100,
      margin: 5,
      position: 'relative',
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? Colors.darkGrey : "#ddd",
    },
    removeImageButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: Colors.Red,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: isDarkMode ? Colors.White : Colors.Black,
      fontSize: 18,
      fontWeight: 'bold',
    },
    categoryText: {
      color: isDarkMode ? Colors.White : "#333",
    },
    helperText: {
      fontSize: 12,
      color: isDarkMode ? Colors.White : '#777',
      marginTop: 5,
    },
  });
};

export default getStyles;