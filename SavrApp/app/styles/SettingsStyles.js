import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const getStyles = (darkMode) => {
  // Définition du thème basé sur le paramètre darkMode
  const theme = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    inputBackground: darkMode ? COLORS.grey800 : COLORS.surface,
    placeholder: darkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
    primary: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
    overlay: darkMode ? COLORS.overlayDark : COLORS.overlayLight,
    disabled: COLORS.disabled,
    error: COLORS.error,
  };

  return StyleSheet.create({
    passwordInput: {
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
    },
    eyeIconContainer: {
      padding: 10,
      minWidth: 45,
    },
    eyeIcon: {
      color: theme.text,
      size: 20,
    },
    backIcon: {
      size: 24,
      color: theme.text,
    },  
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loader: {
      color: COLORS.info,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    settingsGlobalContainer: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    gearIcon: {
      color: theme.text,
      size: 24,
      marginRight: 20,
      marginLeft: 10,
    },
    settingsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    settingsFormContainer: {
      width: "100%",
      alignItems: "center",
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      fontSize: 14,
      fontFamily: "PoppinsRegular",
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      color: theme.text,
      placeholderTextColor: theme.placeholder,
    },
    editableInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    editableInput: {
      width: "80%",
      color: theme.text,
      fontSize: 14,
      placeholderTextColor: theme.placeholder,
    },
    editIconContainer: {
      padding: 10,
      hitSlop: { top: 5, bottom: 5, left: 5, right: 5 },
      minWidth: 45,
    },
    editIcon: {
      color: theme.text,
      size: 20,
    },
    editablePasswordContainer: {
      width: "100%",
      alignItems: "center",
    },
    submitButtonContainer: {
      width: "80%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cancelButton: {
      width: "45%",
      borderColor: COLORS.grey500,
      backgroundColor: COLORS.grey500,
      color: COLORS.textDark,
    },
    cancelButtonText: {
      width: "100%",
      height: 50,
      textAlign: "center",
      textAlignVertical: "center",
      color: COLORS.textDark,
      fontSize: 16,
      fontWeight: "bold",
    },
    submitButton: {
      width: "45%",
      backgroundColor: theme.primary,
      color: theme.text,
    },
    submitButtonText: {
      width: "100%",
      height: 50,
      textAlign: "center",
      textAlignVertical: "center",
      color: darkMode ? COLORS.textLight : COLORS.textDark,
      fontSize: 16,
      fontWeight: "bold",
    },
    privacyPolicyContainer: {
      alignItems: 'center',
      marginTop: 20,
      paddingHorizontal: 16,
    },
    privacyPolicyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    privacyPolicyIcon: {
      size: 20,
      color: theme.text,
    },
    privacyPolicyText: {
      fontSize: 16,
      color: theme.text,
      textDecorationLine: 'underline',
      marginLeft: 8,
    },
    button: {
      backgroundColor: COLORS.error,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: COLORS.textDark,
      fontSize: 16,
      fontWeight: "600",
    },
    dropdownContainer: {
      width: '95%',
      marginBottom: 20,
    },
    dropdownHeader: {
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
    },
    selectedText: {
      fontSize: 14,
      fontFamily: 'PoppinsRegular',
      color: theme.text,
    },
    dropdownList: {
      marginTop: 5,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      maxHeight: 150,
      overflow: 'hidden',
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 15,
    },
    itemText: {
      fontSize: 14,
      fontFamily: 'PoppinsRegular',
      color: theme.text,
    },
    logoutButton: {
      backgroundColor: COLORS.error,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    logoutButtonText: {
      color: COLORS.textDark,
      fontSize: 18,
      fontWeight: "bold",
    },
    statusBar: {
      backgroundColor: theme.background,
      barStyle: darkMode ? "light-content" : "dark-content",
    },
    settingsDropDown: {
      container: {
        position: 'relative',
        zIndex: 1000,
        width: 40, 
        paddingLeft: 15,
        color: theme.text,
      },
      gearButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
      },
      plusIcon: {
        fontSize: 24,
        color: theme.text,
        fontWeight: 'bold',
      },
      dropdownMenu: {
        position: 'absolute',
        top: 45,
        right: -15,
        width: 200, 
        backgroundColor: theme.inputBackground,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 5,
        overflow: 'hidden',
        zIndex: 1001,
        elevation: 5,
      },
      option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      },
      optionText: {
        fontSize: 14,
        color: theme.text,
      },
      overlay: {
        position: 'absolute',
        top: 45,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 999,
      },
      settingsIcon: {
        size: 24,
        color: theme.text,
      }
    }
  });
}

export default getStyles;