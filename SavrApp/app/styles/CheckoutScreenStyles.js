import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const getStyles = (darkMode) => {

  const theme = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    card: darkMode ? COLORS.grey900 : COLORS.surface,
    subtext: darkMode ? COLORS.grey400 : COLORS.grey600,
    discount: darkMode ? COLORS.secondary : COLORS.success,
    buttonBackground: darkMode ? COLORS.surface : COLORS.primary,
    buttonText: darkMode ? COLORS.primary : '#FFFFFF',
  };

  return StyleSheet.create({
    statusBar: {
      backgroundColor: theme.background,
      barStyle: darkMode ? "light-content" : "dark-content",
    },
    emptyText: {
      fontSize: 16,
      color: theme.text,
      textAlign: 'center',
      marginTop: 20,
    },
    container: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: theme.background,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 15,
      color: theme.text,
    },
    backButton: {
      padding: 8,
    },
    productCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    productInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    productTextContainer: {
      flex: 1,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.text,
    },
    shopName: {
      fontSize: 14,
      marginBottom: 4,
      color: theme.subtext,
    },
    pickupTime: {
      fontSize: 14,
      color: theme.subtext,
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    discountPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    originalPrice: {
      fontSize: 14,
      textDecorationLine: 'line-through',
      color: COLORS.error,
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    quantityLabel: {
      fontSize: 16,
      color: theme.text,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
    },
    quantityButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    quantityValue: {
      fontSize: 16,
      marginHorizontal: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    section: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      color: theme.text,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
    },
    selectedPaymentOption: {
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    paymentLabel: {
      fontSize: 16,
      marginLeft: 16,
      flex: 1,
      color: theme.text,
    },
    checkIcon: {
      marginLeft: 'auto',
    },
    creditsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    creditsText: {
      fontSize: 16,
      color: theme.text,
    },
    priceSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.subtext,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    discountValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.discount,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 8,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    bottomContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    payButton: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    payButtonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default getStyles;