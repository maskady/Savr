import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CheckoutContext';
import styles from '../styles/CheckoutScreenStyles';

const CheckoutScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  
  // Use the cart context
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    getCartTotal,
    getTotalItemCount 
  } = useCart();
  
  // Fake data for delivery and service fees - TODO: Replace with actual data
  const deliveryFee = 1.90;
  const serviceFee = 0.99;
  
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + serviceFee;
  const totalItems = getTotalItemCount ? getTotalItemCount() : 0;
  
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
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.emptyText, isDark ? styles.darkText : styles.lightText]}>
          You have no items in your cart at the moment.
        </Text>
      </View>
    );
  }

  // Render single shop group
  const renderShopGroup = ({ item: shop }) => {
    return (
      <View style={[styles.shopGroup, isDark ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.shopName, isDark ? styles.darkText : styles.lightText]}>
          {shop.shopName}
        </Text>
        <Text style={[styles.pickupTime, isDark ? styles.darkSubtext : styles.lightSubtext]}>
          Pick up: {shop.pickupTime}
        </Text>
        
        {shop.items.map(item => renderProductItem(shop.shopId, item))}
      </View>
    );
  };

  // Render single product item
  const renderProductItem = (shopId, item, shopName, pickupTime) => {
    const quantity = item.quantity || 1;
    
    return (
      <View key={shopId.toString() + item.id.toString()} style={[styles.productCard, isDark ? styles.darkCard : styles.lightCard]}>
        <View style={styles.productInfo}>
          <View style={styles.productTextContainer}>
            <Text style={[styles.productName, isDark ? styles.darkText : styles.lightText]}>
              {item.name}
            </Text>
            <Text style={[styles.shopName, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              {shopName}
            </Text>
            <Text style={[styles.pickupTime, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Pick up: {pickupTime}
            </Text>
          </View>
        
          {/* Quantity */}
          <View style={styles.quantitySelector}>
            <Text style={[styles.quantityLabel, isDark ? styles.darkText : styles.lightText]}>
              Quantity:
            </Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[styles.quantityButton, isDark ? styles.darkButton : styles.lightButton]} 
                onPress={() => handleQuantityChange(shopId, item, -1)}
              >
                <Text style={[styles.quantityButtonText, styles.quantityButtonTextDark]}>-</Text>
              </TouchableOpacity>
              
              <Text style={[styles.quantityValue, isDark ? styles.darkText : styles.lightText]}>
                {quantity}
              </Text>
              
              <TouchableOpacity 
                style={[styles.quantityButton, isDark ? styles.darkButton : styles.lightButton]} 
                onPress={() => handleQuantityChange(shopId, item, 1)}
              >
                <Text style={[styles.quantityButtonText, styles.quantityButtonTextDark]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={20} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
            Checkout
          </Text>
        </View>
        
        {/* Products List */}
        <View style={styles.productsList}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText, styles.itemsHeader]}>
            Your Items ({totalItems})
          </Text>
          
          {cartItems.flatMap(shop => 
            shop.items.map(item => renderProductItem(shop.shopId, item, shop.shopName, shop.pickupTime))
          )}
        </View>
        
        {/* Payment method */}
        <View style={[styles.section, isDark ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            Payment method
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              paymentMethod === 'card' && styles.selectedPaymentOption,
              isDark ? styles.darkPaymentOption : styles.lightPaymentOption
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <FontAwesome name="credit-card" size={20} color={isDark ? "#fff" : "#333"} />
            <Text style={[styles.paymentLabel, isDark ? styles.darkText : styles.lightText]}>
              Credit Card
            </Text>
            {paymentMethod === 'card' && (
              <FontAwesome name="check-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              paymentMethod === 'paypal' && styles.selectedPaymentOption,
              isDark ? styles.darkPaymentOption : styles.lightPaymentOption
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <FontAwesome name="paypal" size={20} color={isDark ? "#fff" : "#333"} />
            <Text style={[styles.paymentLabel, isDark ? styles.darkText : styles.lightText]}>
              PayPal
            </Text>
            {paymentMethod === 'paypal' && (
              <FontAwesome name="check-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              paymentMethod === 'apple' && styles.selectedPaymentOption,
              isDark ? styles.darkPaymentOption : styles.lightPaymentOption
            ]}
            onPress={() => setPaymentMethod('apple')}
          >
            <FontAwesome name="apple" size={20} color={isDark ? "#fff" : "#333"} />
            <Text style={[styles.paymentLabel, isDark ? styles.darkText : styles.lightText]}>
              Apple Pay
            </Text>
            {paymentMethod === 'apple' && (
              <FontAwesome name="check-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Summary */}
        <View style={[styles.section, isDark ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            Summary
          </Text>
          
          <View style={styles.priceSummaryRow}>
            <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Sub-total ({totalItems} item{totalItems > 1 ? 's' : ''})
            </Text>
            <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
              {subtotal.toFixed(2)} €
            </Text>
          </View>
          
          <View style={styles.priceSummaryRow}>
            <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Service fee
            </Text>
            <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
              {serviceFee.toFixed(2)} €
            </Text>
          </View>
          
          <View style={styles.priceSummaryRow}>
            <Text style={[styles.summaryLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Shipping fee
            </Text>
            <Text style={[styles.summaryValue, isDark ? styles.darkText : styles.lightText]}>
              {deliveryFee.toFixed(2)} €
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, isDark ? styles.darkText : styles.lightText]}>
              Total
            </Text>
            <Text style={[styles.totalValue, isDark ? styles.darkText : styles.lightText]}>
              {total.toFixed(2)} €
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Payment button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.payButton, isDark ? styles.payButtonDark : null]} onPress={handlePayment}>
          <Text style={[styles.payButtonText, isDark ? styles.payButtonTextDark : null]}>
            Pay {total.toFixed(2)} €
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen;