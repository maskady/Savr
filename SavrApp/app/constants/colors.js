const COLORS = {
    backgroundLight: "white",
    backgroundDark: "#121212",
    cardBackgroundLight: "white",
    cardBackgroundDark: "#333",
    primary: "darkgreen", // remove when everywhere primaryDark and primaryLight are used
    secondary: "darkgreen", // remove when everywhere primaryDark and primaryLight are used
    borderLight: "#ddd",
    borderDark: "#444",
    textLight: "black",
    textDark: "white",
    businesses: {
      "cluster":      "#e6f499",

      "restaurant":   "#66c2a5",
      "canteen":      "#66c2a5",
      
      "butcher":      "#d53e4f",
      
      "florist":      "#5e4ea3",
      
      "fishmonger":   "#3389bd",
      
      "grocery":      "#abdca5",
      "cafe":         "#f56d42", // orange
      "bakery":       "#fdaf60", // light orange

      "other":        "lightgray",
    },
    border: '#e0e0e0',
    placeholder: '#a0a0a0',

  // Semantic status colors
  success:      '#4CAF50',  // green for success states
  error:        '#F44336',  // red for error states
  warning:      '#FF9800',  // orange for warnings
  info:         '#2196F3',  // blue for informational messages

  // Disabled/inactive state colors
  disabled:      '#BDBDBD',
  disabledText:  '#757575',

  // Grayscale scale
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  // Surface & background tokens
  surface:      '#FFFFFF',  // card and sheet backgrounds
  onSurface:    '#000000',  // text/icons on surface
  background:   '#FFFFFF',  // app background (light mode)
  onBackground: '#000000',  // text/icons on background

  // Primary/secondary variants
  primaryLight:   '#66c2a5', // something between green and blue
  primaryDark:    '#66c2a5',

  // Overlay/transparency helpers
  overlayLight: 'rgba(255,255,255,0.12)',
  overlayDark:  'rgba(0,0,0,0.54)',

  // Placeholder colors
  placeholderLight: '#AAAAAA',
  placeholderDark: '#888888',
};

export default COLORS;