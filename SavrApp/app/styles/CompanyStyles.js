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
    isDarkMode: isDarkMode,
    safeArea: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: '#000',
      borderRadius: 50,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
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
      shadowColor: '#000',
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
    },
    companyAddress: {
      fontSize: 14,
      marginBottom: 2,
    },
    companyCity: {
      fontSize: 14,
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
}

export default getStyles;