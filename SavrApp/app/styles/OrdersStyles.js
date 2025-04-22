import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

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
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.text,
      marginLeft: 16,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    orderCard: {
      backgroundColor: themeColors.cardBackground,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: COLORS.onBackground,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    orderId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: COLORS.surface,
      fontSize: 12,
      fontWeight: '600',
    },
    orderDetails: {
      gap: 4,
    },
    orderInfo: {
      fontSize: 14,
      color: themeColors.subText,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: themeColors.subText,
    },
    errorText: {
      fontSize: 16,
      color: COLORS.error,
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