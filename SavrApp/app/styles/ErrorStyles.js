import { StyleSheet } from 'react-native';
import { COLORS } from "../constants/colors";

const getStyles = (darkMode) => {

  const themeColors = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    subText: darkMode ? COLORS.grey300 : COLORS.grey600,
    buttonBackground: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    buttonText: darkMode ? COLORS.textDark : COLORS.textLight,
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.background,
      padding: 20,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: 10,
    },
    message: {
      fontSize: 16,
      color: themeColors.subText,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: themeColors.buttonBackground,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
    },
    buttonText: {
      color: themeColors.buttonText,
      fontSize: 16,
    },
  });
};

export default getStyles;
