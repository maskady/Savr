import { StyleSheet, Appearance } from "react-native";


const getStyles = () => {
  const theme = Appearance.getColorScheme();

  return StyleSheet.create({

    bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 30,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden',
    },
    handleContainer: {
      //height: PEEK_HEIGHT, // Increase this value to make the grab area taller
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d5d5d5',
    },
    handleBar: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: '#888',
      marginVertical: 8,
    },
  })
};

export default getStyles;