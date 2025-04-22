import { StyleSheet, Appearance } from "react-native";
import { COLORS } from "../constants/colors";

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.Black : COLORS.White,
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
      color: isDarkMode ? COLORS.White : COLORS.Black
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
      backgroundColor: isDarkMode ? COLORS.Grey : COLORS.White,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20
    },
    tabButtonText: {
      fontSize: 14,
      color: isDarkMode ? COLORS.White : COLORS.Black,
    },
    buttonText: {
      fontSize: 14,
      color: isDarkMode ? COLORS.White : COLORS.Black,
      fontWeight: 'bold',
      alignContent: 'center',
      textAlign: 'center',
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
      backgroundColor: isDarkMode ? COLORS.Grey : COLORS.White,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      width: '45%'
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.White : COLORS.Black
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? COLORS.lightGrey : COLORS.darkGrey,
      marginTop: 4
    },
    statSubLabel: {
      fontSize: 12,
      color: isDarkMode ? COLORS.lightGrey : COLORS.darkGrey,
      marginTop: 2
    },
    chartTitle: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkMode ? COLORS.White : COLORS.Black
    },
    chartStyle: {
      marginVertical: 8,
      marginBottom: 10,
      paddingBottom: 10,
      borderRadius: 16,
      alignSelf: 'center',
      overflow: 'visible'
    },
    co2Row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30
    },
    co2Item: {
      backgroundColor: isDarkMode ? COLORS.Grey : COLORS.White,
      padding: 10,
      borderRadius: 8
    },
    co2Value: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.White : COLORS.Black
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 60,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? COLORS.darkGrey : COLORS.lightGrey,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    flexContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.Grey : COLORS.White,
    },
    clusterMarker: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',

    },
    clusterContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.lightGrey,
      borderWidth: 2,
      borderColor: COLORS.Black,

    },
    clusterText: {
      color: COLORS.Black,
      fontWeight: 'bold',
      fontSize: 14,
    },
    pinContainer: { 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative' 
    },
    locationPin: {
      
    },
    pinText: {
      color: COLORS.White,
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: -10,
      position: 'absolute', 
      top: '40%', 
      transform: [{ translateY: -8 }], 
      width: '100%', 
      textAlign: 'center',
    },
    map: {
      flex: 1,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    locateButton: {
      position: 'absolute',
      top: '7%',
      right: 10,
      transform: [{ translateY: -25 }],
      backgroundColor: 'transparent',
      padding: 10,
      borderRadius: 5,
      elevation: 2,
      shadowColor: COLORS.Black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    myLocationIcon: {
      fontSize: 20,
      color: isDarkMode ? COLORS.White : COLORS.Black,
    },
    searchOverlay: {
      position: 'absolute',
      top: 30,
      left: 5,
      right: 5,
      zIndex: 100,
    },
    statusBar: {
      backgroundColor: isDarkMode ? COLORS.Black : COLORS.White,
      barStyle: isDarkMode ? 'light-content' : 'dark-content',
    },
    chartConfig: {
      backgroundColor: isDarkMode ? COLORS.Black : COLORS.White,
      backgroundGradientFrom: isDarkMode ? COLORS.Grey : COLORS.White,
      backgroundGradientTo: isDarkMode ? COLORS.Grey : COLORS.White,
      decimalPlaces: 0,
      color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    },
    lineChartConfig: {
      backgroundColor: isDarkMode ? COLORS.Black : COLORS.White,
      backgroundGradientFrom: isDarkMode ? COLORS.Grey : COLORS.White,
      backgroundGradientTo: isDarkMode ? COLORS.Grey : COLORS.White,
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
    },
    addOptionsDropdown: {
      container: {
        position: 'relative',
        zIndex: 1000,
        width: 40,
        paddingLeft: 15,
      },
      addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        shadowColor: COLORS.Black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      },
      dropdownMenu: {
        position: 'absolute',
        top: 45,
        right: -15,
        width: 200,
        backgroundColor: Appearance.getColorScheme() === 'dark' ? COLORS.backgroundDark : COLORS.backgroundLight,
        borderWidth: 1,
        borderColor: Appearance.getColorScheme() === 'dark' ? COLORS.borderDark : COLORS.borderLight,
        borderRadius: 5,
        overflow: 'hidden',
        zIndex: 1001,
        shadowColor: COLORS.Black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      },
      option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Appearance.getColorScheme() === 'dark' ? COLORS.borderDark : COLORS.borderLight,
      },
      optionText: {
        fontSize: 14,
        color: Appearance.getColorScheme() === 'dark' ? COLORS.textDark : COLORS.textLight,
      },
      overlay: {
        position: 'absolute',
        top: 45,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 999,
      },
    },
    categoryDropdown: {
      modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlayDark,
        justifyContent: 'center',
        alignItems: 'center',
      },
      dropdownMenu: {
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        width: 250,
        borderRadius: 4,
        maxHeight: 300,
      },
      dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
      },
      dropdownTrigger: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
      },
    },
    categoryFilter: {
      categoryContainer: {
        paddingVertical: 3,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      },
      categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
        paddingVertical: 1,
        paddingHorizontal: 0,
        borderRadius: 6,
      },
      leftIconContainer: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
      rightSpacer: {
        width: 24,
      },
      categoryText: {
        flexShrink: 1,
        fontSize: 14,
        textAlign: 'center',
      },
      iconActive: {
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      iconInactive: {
        color: isDarkMode ? COLORS.grey400 : COLORS.grey600,
      },
    },
    contactSection: {
      container: {
        marginTop: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
      },
      text: {
        fontSize: 16,
        marginLeft: 12,
        marginBottom: 4,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      inputWrapper: {
        marginLeft: 12,
        flex: 1,
      },
      input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 4,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      label: {
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
        color: isDarkMode ? COLORS.grey400 : COLORS.grey600,
      },
    },
    fullScreenImageModal: {
      overlay: {
        flex: 1,
        backgroundColor: COLORS.overlayDark,
        justifyContent: 'center',
        alignItems: 'center',
      },
      closeBtn: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
        zIndex: 10,
      },
      image: {
        width: '100%',
        height: '80%',
      },
      icon: {
        color: COLORS.textLight,
        // size remains set in the component
      },
    },
  });
}

export default getStyles;
