import { StyleSheet, Appearance } from "react-native";
import { COLORS } from "../constants/colors";

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
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
      color: isDarkMode ? COLORS.textDark : COLORS.textLight
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
      backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20
    },
    tabButtonText: {
      fontSize: 14,
      color: isDarkMode ? COLORS.textDark : COLORS.textLight,
    },
    buttonText: {
      fontSize: 14,
      color: isDarkMode ? COLORS.textDark : COLORS.textLight,
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
      backgroundColor: isDarkMode ? COLORS.cardBackgroundDark : COLORS.cardBackgroundLight,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      width: '45%',
      elevation: 2,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? COLORS.textDark : COLORS.textLight
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      marginTop: 4
    },
    statSubLabel: {
      fontSize: 12,
      color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      marginTop: 2
    },
    chartTitle: {
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkMode ? COLORS.textDark : COLORS.textLight,
    },
    chartStyle: {
      marginVertical: 8,
      marginBottom: 10,
      paddingBottom: 10,
      borderRadius: 16,
      alignSelf: 'center',
      overflow: 'visible',
      backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      borderWidth: 1,
      borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
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
      backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
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
      backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      barStyle: isDarkMode ? 'light-content' : 'dark-content',
    },
    chartConfig: {
      backgroundGradientFrom: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      backgroundGradientTo: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
      color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      propsForBackgroundLines: {
        stroke: isDarkMode ? COLORS.grey800 : COLORS.grey300,
      },
      decimalPlaces: 2,
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
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
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
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
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
        borderBottomColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
      },
      optionText: {
        fontSize: 14,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
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
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
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
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
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
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
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
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      label: {
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
        color: isDarkMode ? COLORS.grey400 : COLORS.grey600,
      },
      icon: {
        color: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        size: 20,
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
    imageGallery: {
      container: {
        width: '100%',
        position: 'relative',
      },
      slide: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: '100%',
        height: '100%',
      },
      placeholderImage: {
        width: '100%',
        height: '100%',
      },
      pagination: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      },
      paginationDotActive: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      captionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
      },
      caption: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
      },
    },
    imageUploadModal: {
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.overlayDark,
      },
      modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        borderRadius: 15,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: COLORS.Black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        padding: 8,
        zIndex: 10,
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      imageContainer: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
      },
      imagePreview: {
        width: '100%',
        height: 240,
        borderRadius: 10,
      },
      imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: isDarkMode ? COLORS.grey200 : COLORS.grey100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      placeholderText: {
        color: COLORS.grey600,
        marginTop: 10,
        fontSize: 16,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
      },
      actionButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 130,
        marginHorizontal: 5,
      },
      uploadButton: {
        backgroundColor: isDarkMode ? COLORS.success : COLORS.success,
      },
      disabledButton: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        opacity: 0.5,
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: COLORS.textLight,
        fontWeight: 'bold',
        fontSize: 16,
      },
      buttonIcon: {
        marginRight: 8,
      },
    },
    iosKeyboardToolbar: {
      toolbarContainer: {
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.grey200,
        padding: 6,
        alignItems: 'flex-end',
      },
    },
    listItem: {
      container: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: isDarkMode ? COLORS.cardBackgroundDark : COLORS.cardBackgroundLight,
      },
      image: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.placeholder,
      },
      info: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
      },
      title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      subtitle: {
        fontSize: 14,
        marginBottom: 4,
        color: isDarkMode ? COLORS.grey400 : COLORS.grey600,
      },
      categoryText: {
        fontSize: 12,
        color: isDarkMode ? COLORS.grey400 : COLORS.grey600,
      },
      arrowContainer: {
        paddingHorizontal: 12,
        justifyContent: 'center',
      },
    },
    mapDemo: {
      markerContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
      },
      markerBubble: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
        padding: 4,
        borderRadius: 4,
        borderColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
        borderWidth: 1,
      },
      markerCount: {
        color: COLORS.textLight,
        fontSize: 13,
      },
      map: {
        ...StyleSheet.absoluteFill,
      },
    },
    mapSection: {
      container: {
        flex: 1,
      },
    },
    orderAndPay: {
      container: {
        padding: 16,
        backgroundColor: 'transparent',
      },
      payButton: {
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      disabledButton: {
        backgroundColor: COLORS.grey400,
      },
      payButtonText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: '600',
      },
    },
    productDetailsModal: {
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      modalContent: {
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        maxHeight: '90%',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      closeButton: {
        padding: 2,
        size: 24,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      productImage: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
      },
      noImageText: {
        color: COLORS.textLight,
        fontSize: 16,
      },
      productImagePlaceholder: {
        backgroundColor: COLORS.placeholder,
      },
      iconStyle: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
      },
      indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.borderLight,
        marginHorizontal: 3,
      },
      activeIndicator: {
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
      },
      priceContainer: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      originalPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
        marginRight: 8,
      },
      discountBadge: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
      },
      discountText: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
        fontWeight: 'bold',
        fontSize: 12,
      },
      section: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      },
      detailLabel: {
        fontSize: 16,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      button: {
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        margin: 16,
      },
      buttonText: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    quantityCartButton: {
      addButton: {
        backgroundColor: isDarkMode ? COLORS.primaryDark : isDarkMode ? COLORS.primaryDark : COLORS.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 20,
        backgroundColor: isDarkMode ? COLORS.grey800 : COLORS.grey200,
        overflow: 'hidden',
      },
      quantityButton: {
        width: 36,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
      },
      quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      quantityTextContainer: {
        minWidth: 32,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
    },
    search: {
      header: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 20,
      },
      searchIconContainer: {
        padding: 8,
      },
      searchInput: {
        flex: 1,
        height: 40,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      searchText: {
        fontSize: 16,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,      
      },
      searchIcon: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
    },
    shopContent: {
      center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      containerPadding: {
        padding: 16,
      },
      loadingText: {
        marginTop: 12,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      errorText: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      button: {
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        color: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
      },
      buttonText: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
        fontWeight: 'bold',
      },
      loadingIndicator: {
        color: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        size: "large",
      },
    },
    shopDescription: {
      container: {
        borderBottomWidth: 1,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      text: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.placeholder,
      },
      input: {
        fontSize: 16,
        lineHeight: 24,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 4,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      label: {
        fontSize: 12,
        marginTop: 4,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
    },
    shopInfoSection: {
      container: {
        marginBottom: 24,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
      category: {
        fontSize: 16,
        marginBottom: 16,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
      postButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'flex-start',
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
      },
      postButtonText: {
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      nameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        borderRadius: 8,
        padding: 8,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
        placeholderTextColor: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
      label: {
        fontSize: 12,
        marginTop: 4,
        marginBottom: 12,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
      starIcon: {
        fillColorTrue: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        fillColorFalse: 'none',
        colorTrue: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        colorFalse: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
      },
    },
    shopHeader: {
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
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
      },
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,        
        borderRadius: 20,
      },
      disabledButton: {
        opacity: 0.6,
      },
      toggleButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginLeft: 8,
      },
      shareButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        marginLeft: 8,
      },
      buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 6,
        marginRight: 6,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
      buttonIcon: {
        marginRight: 6,
        marginLeft: 4,
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
      },
    },
    shopMapSection: {
      container: {
        marginTop: 24,
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      button: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
      },
      buttonText: {
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
        fontWeight: 'bold',
      },
    },
    shopProductList: {
      list: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
        paddingBottom: 8,
        marginBottom: 16,
      },
      card: {
        backgroundColor: isDarkMode ? COLORS.cardBackgroundDark : COLORS.cardBackgroundLight,
        borderRadius: 8,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
      },
      cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
      },
      productInfo: {
        flex: 1,
      },
      productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      productDescription: {
        fontSize: 14,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
        marginBottom: 4,
      },
      priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      originalPrice: {
        fontSize: 14,
        color: isDarkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
        textDecorationLine: 'line-through',
        marginRight: 6,
      },
      price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        marginRight: 12,
      },
      quantity: {
        fontSize: 13,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      addButton: {
        backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primaryLight,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
      },
      addButtonText: {
        color: isDarkMode ? COLORS.textLight : COLORS.textDark,
        fontSize: 24,
        fontWeight: 'bold',
      },
      separator: {
        height: 1,
        backgroundColor: isDarkMode ? COLORS.grey200 : COLORS.grey100,
      },
      loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      error: {
        color: COLORS.error,
        padding: 16,
        textAlign: 'center',
      },
      empty: {
        textAlign: 'center',
        marginTop: 32,
        fontSize: 16,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
      listHeader: {
        backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginBottom: 8,
      },
      textListHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: isDarkMode ? COLORS.textDark : COLORS.textLight,
      },
    },
    stripePaymentProvider: {
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  });
}

export default getStyles;
