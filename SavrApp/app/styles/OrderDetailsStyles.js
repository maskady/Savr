import { StyleSheet } from 'react-native';
import { COLORS } from "../constants/colors";

const getStyles = (darkMode) => {
  
  const themeColors = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    subText: darkMode ? COLORS.grey300 : COLORS.grey600,
    cardBackground: darkMode ? COLORS.grey800 : COLORS.surface,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    icon: darkMode ? COLORS.textDark : COLORS.textLight,
    divider: darkMode ? COLORS.grey600 : COLORS.grey300,
  };

  return StyleSheet.create({
    statusBar: {
      backgroundColor: themeColors.background,
      barStyle: darkMode ? 'light-content' : 'dark-content',
    },
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.background,
    },
    icon: {
      color: themeColors.icon,
    },
    header: {
      marginTop: 50, // Adjust for notch
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    headerSpacer: {
      width: 24, // to balance the header
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themeColors.text,
      flex: 1,
      textAlign: 'center',
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    orderInfoContainer: {
      backgroundColor: themeColors.cardBackground,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      shadowColor: COLORS.onBackground,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: 12,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      color: COLORS.surface,
      fontSize: 14,
      fontWeight: '600',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: themeColors.subText,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: themeColors.text,
      textAlign: 'right',
    },
    divider: {
      height: 1,
      backgroundColor: themeColors.divider,
      marginVertical: 16,
    },
    productCard: {
      flexDirection: 'row',
      backgroundColor: themeColors.cardBackground,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      shadowColor: COLORS.onBackground,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 4,
      backgroundColor: darkMode ? COLORS.grey700 : COLORS.grey200,
    },
    productInfo: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 16,
      fontWeight: '500',
      color: themeColors.text,
      marginBottom: 4,
    },
    productQuantity: {
      fontSize: 14,
      color: themeColors.subText,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
      marginTop: 4,
    },
    noItemsText: {
      fontSize: 16,
      color: themeColors.subText,
      textAlign: 'center',
      marginVertical: 20,
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: themeColors.divider,
      marginTop: 8,
      marginBottom: 30,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    errorText: {
      fontSize: 16,
      color: themeColors.subText,
      marginBottom: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    retryText: {
      color: COLORS.surface,
      fontWeight: '600',
    },
  });
};

export default getStyles;