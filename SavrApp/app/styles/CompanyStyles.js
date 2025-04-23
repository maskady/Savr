import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";

const getStyles = (darkMode) => {

  const themeColors = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    shadow: darkMode ? COLORS.overlayDark : COLORS.overlayLight,
    card: darkMode ? COLORS.grey800 : COLORS.surface,
    addButton: darkMode ? COLORS.primaryLight : COLORS.primaryDark,
  };

  return StyleSheet.create({
    statusBar: {
      backgroundColor: themeColors.background,
      barStyle: darkMode ? 'light-content' : 'dark-content',
    },
    safeArea: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      backgroundColor: themeColors.background,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    addButton: {
      backgroundColor: themeColors.addButton,
      borderRadius: 50,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      color: themeColors.addButton,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    companyCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: themeColors.text,
    },
    companyAddress: {
      fontSize: 14,
      marginBottom: 2,
      color: themeColors.text,
    },
    companyCity: {
      fontSize: 14,
      color: themeColors.text,
    },
    editButton: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
  });
};

export default getStyles;
