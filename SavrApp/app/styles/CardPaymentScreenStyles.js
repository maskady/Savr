import { StyleSheet } from 'react-native';

// Couleurs partagées entre thèmes
const colors = {
  primary: '#000',
  primaryDark: '#333',
  secondary: '#8BC34A',
  error: '#F44336',
  success: '#4CAF50',
  // Couleurs claires
  lightBackground: '#FFFFFF',
  lightCard: '#F5F5F5',
  lightText: '#212121',
  lightSubtext: '#757575',
  lightBorder: '#E0E0E0',
  // Couleurs sombres
  darkBackground: '#121212',
  darkCard: '#333',
  darkText: '#FFFFFF',
  darkSubtext: '#B0B0B0',
  darkBorder: '#fff',
};

const styles = StyleSheet.create({
  // Conteneurs principaux
  container: {
    flex: 1,
    paddingTop: 50,
  },
  lightContainer: {
    backgroundColor: colors.lightBackground,
  },
  darkContainer: {
    backgroundColor: colors.darkBackground,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  backButton: {
    padding: 8,
  },
  
  // Carte montant
  amountCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  // Formulaire carte
  cardForm: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  lightCard: {
    backgroundColor: colors.lightCard,
    borderColor: colors.lightBorder,
    borderWidth: 1,
  },
  
  // Groupes d'inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: colors.lightInputBg,
    borderColor: colors.lightBorder,
    color: colors.lightText,
  },
  darkInput: {
    backgroundColor: colors.darkInputBg,
    borderColor: colors.darkBorder,
    color: colors.darkText,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Container pour numéro de carte avec icône
  cardNumberContainer: {
    position: 'relative',
  },
  cardIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  
  // Option sauvegarde carte
  saveCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkCheckbox: {
    borderColor: colors.darkBorder,
  },
  lightCheckbox: {
    borderColor: colors.lightBorder,
  },
  checkboxChecked: {
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    borderColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  },
  saveCardText: {
    fontSize: 14,
  },
  
  // Informations de sécurité
  securityInfo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 13,
    lineHeight: 18,
  },
  
  // Bouton de paiement
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
  },
  payButton: {
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  darkPayButton: {
    backgroundColor: colors.lightBackground,
  },
  payButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkPayButtonText: {
    color: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  },
  
  // Textes selon thèmes
  darkText: {
    color: colors.darkText,
  },
  lightText: {
    color: colors.lightText,
  },
  darkSubtext: {
    color: colors.darkSubtext,
  },
  lightSubtext: {
    color: colors.lightSubtext,
  },
});

export default styles;