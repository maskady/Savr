import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStripe, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { Appearance } from 'react-native';
import { request } from '../utils/request';
import { APP_NAME } from '@env';

const OrderAndPay = ({ orderId, cartItems, onPaymentSuccess, onPaymentError }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(orderId);
  
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === 'dark';

  const createOrder = async () => {
    let payload = null;

    try {
      let items = cartItems;
      let shopId = items[0].shopId;

      let productVariants = items[0].items.map(item => ({
        productVariantId: item.id,
        quantity: item.quantity
      }));

      let order = {
        shopId: shopId,
        status: "pen",
        productVariants: productVariants
      }

      const { response, data } = await request(`/order`, 'POST', order);

      console.log('Order created:', JSON.stringify(data, null, 2));
      payload = data?.data;

    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    return payload;
  }

  const onOrderAndPay = async () => {
    try {
      setLoading(true);
      const data = await createOrder();
      console.log('Order:', data);
      const newOrderId = data?.orderId;
      
      if (newOrderId) {
        setCurrentOrderId(newOrderId);
        // Initialize payment sheet with the new order ID
        await initializePaymentSheet(newOrderId);
        // Open payment sheet after initialization
        await openPaymentSheet();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error in order and pay:', error);
      onPaymentError && onPaymentError('Failed to process order');
      setLoading(false);
    }
  }
  
  const fetchPaymentSheetParams = async (orderIdToUse) => {
    try {
      console.log('Fetching payment sheet for order:', orderIdToUse);
      
      // REAL API CALL - Use this in production
      const { response, data } = await request(`/payment/${orderIdToUse}/payment-sheet`, 'GET');

      if (!response.ok) {
        console.error('Payment sheet fetch error:', response.status, data);
        throw new Error(`Failed to fetch payment details: ${response.status}`);
      }
      
      const { paymentIntent, ephemeralKey, customer, publishableKey } = data;
      return {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      };
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      onPaymentError && onPaymentError('Failed to initialize payment. Please try again.');
      return null;
    }
  };

  const initializePaymentSheet = async (orderIdToUse) => {
    try {
      if (!orderIdToUse) {
        console.error('No order ID provided for payment sheet initialization');
        return;
      }
      
      const params = await fetchPaymentSheetParams(orderIdToUse);
      console.log('Payment sheet params:', JSON.stringify(params, null, 2));
      
      if (!params) {
        return;
      }
      
      const { paymentIntent, ephemeralKey, customer, publishableKey } = params;

      const { error } = await initPaymentSheet({
        merchantDisplayName: APP_NAME,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        appearance: {
          colors: {
            primary: '#007AFF',
            background: isDarkMode ? '#121212' : '#FFFFFF',
            componentBackground: isDarkMode ? '#333333' : '#F5F5F5',
            componentText: isDarkMode ? '#FFFFFF' : '#000000',
          },
        },
        merchantCountryCode: 'FI', // Use your country code
        testEnv: true, // Set to false in production
        publishableKey: publishableKey,
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        onPaymentError && onPaymentError(error.message);
      } else {
        setReady(true);
      }
    } catch (error) {
      console.error('Error in initializePaymentSheet:', error);
      onPaymentError && onPaymentError('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { error, paymentOption } = await presentPaymentSheet();
      console.log('Payment option:', paymentOption, error);
      
      if (error) {
        console.error('Payment sheet error:', error);
        onPaymentError && onPaymentError(error.message);
      } else {
        console.log('Payment success with option:', paymentOption);
        onPaymentSuccess && onPaymentSuccess({ id: currentOrderId });
      }
    } catch (error) {
      console.error('Error presenting payment sheet:', error);
      onPaymentError && onPaymentError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize if an order ID is already provided
    if (currentOrderId) {
      initializePaymentSheet(currentOrderId);
    } else {
      setReady(true); // Set ready so the button is enabled
    }
  }, [currentOrderId]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.payButton, 
          (loading) && styles.disabledButton
        ]} 
        disabled={loading}
        onPress={onOrderAndPay}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.payButtonText}>Order and Pay</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderAndPay; 