import { StyleSheet, Appearance } from "react-native";

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  const Colors = {
    Black: "black",
    White: "white",
    Grey: "#333",
    lightGrey: "#bbb",
    darkGrey: "#666",
    classicGrey: "grey",
    disableGreyDarkMode: "#c1c1c1",
    disableGreyLightMode: "#f1f1f1",
  }

  return StyleSheet.create({
    passwordInput: {
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: isDarkMode ? "#444" : "#ddd",
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
    },
    eyeIconContainer: {
      padding: 10,
      minWidth: 45,
    },
    eyeIcon: {
      color: isDarkMode ? Colors.White : Colors.Black,
      size: 20,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    loader: {
      color: "#0000ff",
    },
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    settingsGlobalContainer: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    gearIcon: {
      color: isDarkMode ? Colors.White : Colors.Black,
      size: 24,
      marginRight: 20,
    },
    settingsTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDarkMode ? Colors.White : Colors.Black,
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
      borderColor: isDarkMode ? "#444" : "#ddd",
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      color: isDarkMode ? Colors.White : Colors.Black,
      placeholderTextColor: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    editableInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    editableInput: {
      width: "80%",
      color: isDarkMode ? Colors.White : Colors.Black,
      fontSize: 14,
      placeholderTextColor: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    editIconContainer: {
      padding: 10,
      hitSlop: { top: 5, bottom: 5, left: 5, right: 5 },
      minWidth: 45,
    },
    editIcon: {
      color: isDarkMode ? Colors.White : Colors.Black,
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
      borderColor: Colors.classicGrey,
      backgroundColor: Colors.classicGrey,
      color: Colors.White,
    },
    cancelButtonText: {
      width: "100%",
      height: 50,
      textAlign: "center",
      textAlignVertical: "center",
      color: Colors.White,
      fontSize: 16,
      fontWeight: "bold",
    },
    submitButton: {
      width: "45%",
      backgroundColor: Colors.White,
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    submitButtonText: {
      width: "100%",
      height: 50,
      textAlign: "center",
      textAlignVertical: "center",
      color: Colors.Black,
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
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    privacyPolicyText: {
      fontSize: 16,
      color: isDarkMode ? Colors.White : Colors.Black,
      textDecorationLine: 'underline',
      marginLeft: 8,
    },
    button: {
      backgroundColor: "#ff4d4d",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
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
      borderColor: isDarkMode ? '#444' : '#ddd',
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
    },
    selectedText: {
      fontSize: 14,
      fontFamily: 'PoppinsRegular',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    dropdownList: {
      marginTop: 5,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: isDarkMode ? '#444' : '#ddd',
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
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
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    logoutButton: {
      backgroundColor: "#ff4d4d",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 10,
    },
    logoutButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    statusBar: {
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
      barStyle: isDarkMode ? "light-content" : "dark-content",
    },
    settingsDropDown: {
      container: {
        position: 'relative',
        zIndex: 1000,
        width: 40, 
        paddingLeft: 15,
        color: isDarkMode ? Colors.White : Colors.Black,
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
        color: isDarkMode ? Colors.White : Colors.Black,
        fontWeight: 'bold',
      },
      dropdownMenu: {
        position: 'absolute',
        top: 45,
        right: -15,
        width: 200, 
        backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
        borderWidth: 1,
        borderColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
        borderRadius: 5,
        overflow: 'hidden',
        zIndex: 1001,
        elevation: 5,
      },
      option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
      },
      optionText: {
        fontSize: 14,
        color: isDarkMode ? Colors.White : Colors.Black,
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
        color: isDarkMode ? Colors.White : Colors.Black,
      }
    }
  });
}

export default getStyles;