import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const getStyles = (darkMode) => {
  
  const themeColors = {
    background: darkMode ? COLORS.backgroundDark : COLORS.backgroundLight,
    text: darkMode ? COLORS.textDark : COLORS.textLight,
    border: darkMode ? COLORS.borderDark : COLORS.borderLight,
    inputBg: darkMode ? COLORS.grey800 : COLORS.surface,
    cardBg: darkMode ? COLORS.grey800 : COLORS.surface,
    placeholder: darkMode ? COLORS.placeholderDark : COLORS.placeholderLight,
    primary: darkMode ? COLORS.primaryDark : COLORS.primaryLight,
    secondary: darkMode ? COLORS.grey700 : COLORS.grey300,
  };

  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: themeColors.background,
      minHeight: '100%',
    },
    label: {
      fontSize: 16,
      marginTop: 12,
      color: themeColors.text,
    },
    input: {
      marginTop: 8,
      padding: 12,
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 16,
      backgroundColor: themeColors.inputBg,
      borderColor: themeColors.border,
      color: themeColors.text,
      placeholderTextColor: themeColors.placeholder,
    },
    cancelButton: {
      paddingVertical: 6,
      borderRadius: 6,
      alignItems: 'center',
      width: '30%',
      alignSelf: 'flex-end',
      backgroundColor: themeColors.secondary,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    imagePicker: {
      marginTop: 8,
      height: 200,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: themeColors.border,
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      borderRadius: 6,
    },
    submitButton: {
      marginTop: 24,
      paddingVertical: 14,
      borderRadius: 6,
      alignItems: 'center',
      backgroundColor: themeColors.primary,
    },
    submitText: {
      color: COLORS.surface,
      fontSize: 16,
      fontWeight: 'bold',
    },
    suggestionsContainer: {
      backgroundColor: themeColors.cardBg,
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 6,
      maxHeight: 150,
      marginBottom: 8,
    },
    suggestionItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    suggestionText: {
      fontSize: 16,
      color: themeColors.text,
    },
    errorMessage: {
      color: COLORS.error,
      marginTop: 4,
    },
    imageManagerContainer: {
      marginTop: 8,
    },
    dropdownContainer: {
      marginTop: 8,
    }
  });
};

export default getStyles;