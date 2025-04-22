import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const getStyles = (darkMode) => {
  const backgroundColor = darkMode ? COLORS.backgroundDark : COLORS.backgroundLight;
  const textColor = darkMode ? COLORS.textDark : COLORS.textLight;
  const borderColor = darkMode ? COLORS.borderDark : COLORS.borderLight;
  const inputBgColor = darkMode ? COLORS.grey800 : COLORS.surface;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: textColor,
      textAlign: 'center',
      marginLeft: 10,
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
      color: textColor,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 14,
      borderColor,
      backgroundColor: inputBgColor,
      color: textColor,
    },
    inputError: {
      borderColor: COLORS.error,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      color: COLORS.error,
      fontSize: 14,
      marginTop: 5,
    },
    submitButton: {
      backgroundColor: darkMode ? COLORS.textDark : COLORS.textLight,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    submitButtonText: {
      color: darkMode ? COLORS.textLight : COLORS.textDark,
      fontSize: 18,
      fontWeight: 'bold',
    },
    imagePickerButton: {
      backgroundColor: inputBgColor,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor,
      borderStyle: 'dashed',
    },
    imagePickerButtonText: {
      color: textColor,
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
      borderColor,
    },
    removeImageButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: COLORS.error,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: textColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    categoryText: {
      color: textColor,
    },
    helperText: {
      fontSize: 12,
      color: darkMode ? COLORS.grey300 : COLORS.placeholder,
      marginTop: 5,
    },
  });
};

export default getStyles;
