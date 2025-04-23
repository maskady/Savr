import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const getStyles = (darkMode) => {
  const theme = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    subtext: darkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
    primary: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
    card: darkMode ? COLORS.grey800 : COLORS.grey200,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info,
    disabled: COLORS.disabled,
    overlay: darkMode ? COLORS.overlayDark : COLORS.overlayLight,
  };

  return StyleSheet.create({
    colors: {
      success: theme.success,
      error: theme.error,
      warning: theme.warning,
      info: theme.info,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      zIndex: 10,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    backButton: {
      padding: 8,
      backgroundColor: theme.overlay,
      borderRadius: 20,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    saveButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: `${theme.primary}DD`,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
      marginLeft: 6,
      marginRight: 6,
    },
    buttonIcon: {
      marginRight: 6,
    },
    shareButton: {
      padding: 8,
      backgroundColor: theme.overlay,
      borderRadius: 20,
    },
    infoContainer: {
      padding: 16,
    },
    shopName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingText: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.text,
    },
    categoryText: {
      fontSize: 16,
      marginBottom: 16,
      color: theme.text,
    },
    sectionContainer: {
      marginTop: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme.text,
    },
    descriptionText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.text,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    contactText: {
      fontSize: 16,
      marginBottom: 4,
      marginLeft: 12,
      color: theme.text,
    },
    mapContainer: {
      marginTop: 24,
      height: 200,
      borderRadius: 8,
      overflow: 'hidden',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    directionsButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.primary,
    },
    directionsButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    productCard: {
      flexDirection: 'row',
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.card,
    },
    productImage: {
      width: 80,
      height: 80,
    },
    productInfo: {
      flex: 1,
      padding: 12,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.text,
    },
    productDescription: {
      fontSize: 14,
      marginBottom: 8,
      color: theme.subtext,
    },
    productPriceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    productOriginalPrice: {
      fontSize: 14,
      textDecorationLine: 'line-through',
      marginRight: 8,
      color: theme.subtext,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: theme.text,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: theme.primary,
    },
    fullScreenModal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullScreenImage: {
      width: '100%',
      height: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      zIndex: 10,
      padding: 10,
    },
    addressContainer: {
      marginLeft: 12,
      flex: 1,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginBottom: 4,
      fontSize: 16,
      borderColor: theme.border,
      color: theme.text,
      backgroundColor: darkMode ? COLORS.grey800 : COLORS.surface,
    },
    inputLabel: {
      fontSize: 12,
      color: theme.subtext,
      marginBottom: 12,
      marginLeft: 4,
    },
    dropdownContainer: {
      width: 150,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      marginVertical: 8,
      overflow: 'hidden'
    },
    dropdownPicker: {
      height: 40,
      width: '100%',
      backgroundColor: darkMode ? COLORS.grey800 : COLORS.surface,
    },
    dropdownTrigger: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      marginVertical: 8,
      backgroundColor: darkMode ? COLORS.grey800 : COLORS.surface,
    },
    dropdownTriggerText: {
      fontSize: 16,
      color: theme.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownMenu: {
      backgroundColor: darkMode ? COLORS.grey800 : COLORS.surface,
      borderRadius: 4,
      width: 250,
      maxHeight: 300,
      paddingVertical: 8,
    },
    dropdownItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    dropdownItemText: {
      fontSize: 16,
      color: theme.text,
    },
  });
};

export default getStyles;