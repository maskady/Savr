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
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    header: {
      marginTop: 50, // Adjust for notch
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black
    },
    settingsButton: {
      padding: 8
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 10
    },
    tabButton: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20
    },
    tabButtonText: {
      fontSize: 14,
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 10
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10
    },
    statCard: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      width: '45%'
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
      marginTop: 4
    },
    statSubLabel: {
      fontSize: 12,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
      marginTop: 2
    },
    chartTitle: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkMode ? Colors.White : Colors.Black
    },
    chartStyle: {
      marginVertical: 8,
      borderRadius: 16,
      alignSelf: 'center'
    },
    co2Row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30
    },
    co2Item: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      padding: 10,
      borderRadius: 8
    },
    co2Value: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    flexContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
    },
    map: {
      flex: 1,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    searchOverlay: {
      position: 'absolute',
      top: 30,
      left: 5,
      right: 5,
      zIndex: 100,
    },
    statusBar: {
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
      barStyle: isDarkMode ? 'light-content' : 'dark-content',
    },
    chartConfig: {
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
      backgroundGradientFrom: isDarkMode ? Colors.Grey : Colors.White,
      backgroundGradientTo: isDarkMode ? Colors.Grey : Colors.White,
      decimalPlaces: 0,
      color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    },
    lineChartConfig: {
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
      backgroundGradientFrom: isDarkMode ? Colors.Grey : Colors.White,
      backgroundGradientTo: isDarkMode ? Colors.Grey : Colors.White,
      decimalPlaces: 0,
      color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '5',
        strokeWidth: '2',
        stroke: '#1976D2'
      },
    }
  });
}

export default getStyles;

