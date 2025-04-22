import { StyleSheet } from 'react-native';

// Couleurs principales partagées entre thèmes
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
  emptyText: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    marginTop: 20,
  },
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
  
  // Carte produit
  productCard: {
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
  },
  lightCard: {
    backgroundColor: colors.lightCard,
    borderColor: colors.lightBorder,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: colors.error,
  },
  
  // Sélecteur de quantité
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quantityLabel: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkButton: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  lightButton: {
    backgroundColor: colors.lightCard,
    borderColor: colors.lightBorder,
    borderWidth: 1,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  },
  quantityButtonTextDark: {
    color: colors.darkText,
  },
  quantityValue: {
    fontSize: 16,
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  
  // Sections
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Options de paiement
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  darkPaymentOption: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
    borderWidth: 1,
  },
  lightPaymentOption: {
    backgroundColor: colors.lightCard,
    borderColor: colors.lightBorder,
    borderWidth: 1,
  },
  selectedPaymentOption: {
    borderColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    borderWidth: 2,
  },
  paymentLabel: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  
  // Ligne crédits
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditsText: {
    fontSize: 16,
  },
  
  // Résumé des prix
  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  darkDiscount: {
    color: colors.secondary,
  },
  lightDiscount: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBorder,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
  
  // Bouton de paiement
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  payButton: {
    backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonDark: {
    backgroundColor: colors.lightBackground,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButtonTextDark: {
    color: isDarkMode ? COLORS.primaryDark : COLORS.primary,
  },
});

export default styles;