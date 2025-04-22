import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CheckoutContext';
import OrderAndPay from '../components/OrderAndPay';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY, STRIPE_MERCHANT_ID, STRIPE_URL_SCHEME } from '@env';
import { SettingsContext } from '../contexts/SettingsContext';
import getStyles from '../styles/CheckoutStyles';


const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));
  
  // Use the cart context
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    getCartTotal,
    itemCount,
  } = useCart();
  
  const deliveryFee = 0;
  const serviceFee = 0;
  
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + serviceFee;
  
  const handleQuantityChange = (shopId, item, increment) => {
    if (increment > 0) {
      addToCart(item);
    } else {
      removeFromCart(shopId, item.id);
    }
  };
  
  const handlePayment = () => {
    navigation.navigate('CardPayment', { amount: total });
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // TODO: Handle payment success
  };

  const handlePaymentError = (error) => {
    console.log('Payment error:', error);
    Alert.alert('Payment Error', error.message);
  };

  useEffect(() => {
    setStyles(getStyles(darkMode));
  }, [darkMode]);
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <StatusBar
          barStyle={styles.statusBar.barStyle}
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <View style={styles.container}>
          <Text style={styles.emptyText}>
            You have no items in your cart at the moment.
          </Text>
        </View>
      </>
    );
  }  

  // Render single product item
  const renderProductItem = (shopId, item, shopName, pickupTime) => {
    const quantity = item.quantity || 1;
    
    return (

      <View key={shopId.toString() + item.id.toString()} style={styles.productCard}>
        <View style={styles.productInfo}>
          <View style={styles.productTextContainer}>
            <Text style={styles.productName}>
              {item.name}
            </Text>
            <Text style={styles.shopName}>
              {shopName}
            </Text>
            <Text style={styles.pickupTime}>
              Pick up: {pickupTime}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.discountPrice}>
              {item.price?.toFixed(2)} €
            </Text>
            <Text style={styles.originalPrice}>
              {item.originalPrice?.toFixed(2)} €
            </Text>
          </View>
        </View>
        
        {/* Quantity */}
        <View style={styles.quantitySelector}>
          <Text style={styles.quantityLabel}>
            Quantity:
          </Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(shopId, item, -1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityValue}>
              {quantity}
            </Text>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(shopId, item, 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={20} color={darkMode ? "#fff" : "#333"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Checkout
            </Text>
          </View>
          
          {/* Products List */}
          <View style={styles.productsList}>
            <Text style={styles.sectionTitle}>
              Your Items ({itemCount})
            </Text>
            
            {cartItems.flatMap(shop => 
              shop.items.map(item => renderProductItem(shop.shopId, item, shop.shopName, shop.pickupTime))
            )}
          </View>

          {/* Summary */}
          <View style={styles.section}>

            {/* <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
              Summary
            </Text> */}
            
            {/* <View style={styles.priceSummaryRow}>
              <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                Sub-total ({itemCount} item{itemCount > 1 ? 's' : ''})
              </Text>
              <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
                {subtotal?.toFixed(2)} €
              </Text>
            </View> */}
            
            {/* <View style={styles.priceSummaryRow}>
              <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                Service fee
              </Text>
              <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
                {serviceFee?.toFixed(2)} €
              </Text>
            </View> */}
            
            {/* <View style={styles.priceSummaryRow}>
              <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
                Shipping fee
              </Text>
              <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
                {deliveryFee?.toFixed(2)} €
              </Text>
            </View> */}
            
            {/* <View style={styles.divider} /> */}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>
              <Text style={styles.totalValue}>
                {total?.toFixed(2)} €
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Payment button */}
        <View style={styles.bottomContainer}>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} merchantIdentifier={STRIPE_MERCHANT_ID} urlScheme={STRIPE_URL_SCHEME} >
            <OrderAndPay orderId={63} total={total} onPaymentSuccess={handlePaymentSuccess} onPaymentError={handlePaymentError} cartItems={cartItems} />
          </StripeProvider>
        </View>
      </View>
    </>
  );
};

export default CheckoutScreen;