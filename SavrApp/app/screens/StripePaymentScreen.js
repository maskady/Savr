// TODO: Refactor styles
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appearance } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '../contexts/CheckoutContext';
import { request } from '../utils/request';

const StripePaymentScreen = ({ route }) => {
  const { amount = 0, currency = 'EUR' } = route.params || {};
  const navigation = useNavigation();
  const { cartItems, clearCart } = useCart();
  
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === 'dark';

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Process orders after successful payment
      for (const shop of cartItems) {
        const orderData = {
          shopId: shop.shopId,
          status: "pre", // pre-ordered
          productVariants: shop.items.map(product => ({
            productVariantId: product.id,
            quantity: product.quantity
          })),
          // Add payment reference if needed
          paymentIntent: paymentIntent.id
        };

        const { response, data } = await request('/order', 'POST', orderData);
        
        if (!response.ok) {
          console.error('Order creation failed:', data);
          throw new Error('Failed to create order for shop: ' + shop.shopName);
        }
      }
      
      // Clear cart after all orders are created
      clearCart();
      
      // Navigate back to home
      Alert.alert(
        "Payment Successful",
        "Your order has been placed successfully!",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Error processing orders after payment:', error);
      Alert.alert(
        "Order Processing Error",
        "Payment was successful but there was an issue creating your order. Please contact support.",
        [{ text: "OK" }]
      );
    }
  };

  const handlePaymentError = (errorMessage) => {
    Alert.alert(
      "Payment Failed",
      errorMessage || "There was an error processing your payment. Please try again.",
      [{ text: "OK" }]
    );
  };

  return (
    <StripePaymentProvider>
      <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : {}]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <FontAwesome name="arrow-left" size={20} color={isDarkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, isDarkMode ? styles.darkText : {}]}>
                Secure Payment
              </Text>
            </View>
            
            <View style={styles.orderSummary}>
              <Text style={[styles.summaryTitle, isDarkMode ? styles.darkText : {}]}>
                Order Summary
              </Text>
              
              {cartItems.map((shop, index) => (
                <View key={`${shop.shopId}-${index}`} style={styles.shopContainer}>
                  <Text style={[styles.shopName, isDarkMode ? styles.darkText : {}]}>
                    {shop.shopName}
                  </Text>
                  
                  {shop.items.map((item, itemIndex) => (
                    <View key={`${item.id}-${itemIndex}`} style={styles.itemRow}>
                      <Text style={[styles.itemQuantity, isDarkMode ? styles.darkText : {}]}>
                        {item.quantity}x
                      </Text>
                      <Text style={[styles.itemName, isDarkMode ? styles.darkText : {}]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemPrice, isDarkMode ? styles.darkText : {}]}>
                        {(item.price * item.quantity).toFixed(2)} {currency}
                      </Text>
                    </View>
                  ))}
                  
                  <View style={styles.shopTotal}>
                    <Text style={[styles.shopTotalText, isDarkMode ? styles.darkText : {}]}>
                      Shop Total:
                    </Text>
                    <Text style={[styles.shopTotalAmount, isDarkMode ? styles.darkText : {}]}>
                      {shop.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} {currency}
                    </Text>
                  </View>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.totalContainer}>
                <Text style={[styles.totalLabel, isDarkMode ? styles.darkText : {}]}>
                  Total Amount:
                </Text>
                <Text style={[styles.totalAmount, isDarkMode ? styles.darkText : {}]}>
                  {amount.toFixed(2)} {currency}
                </Text>
              </View>
            </View>
            
            <StripePaymentForm 
              orderId={orderId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripePaymentProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  orderSummary: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  shopContainer: {
    marginBottom: 16,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  itemQuantity: {
    width: 30,
    color: '#000000',
  },
  itemName: {
    flex: 1,
    color: '#000000',
  },
  itemPrice: {
    width: 80,
    textAlign: 'right',
    color: '#000000',
  },
  shopTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  shopTotalText: {
    fontWeight: '600',
    color: '#000000',
  },
  shopTotalAmount: {
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default StripePaymentScreen; 