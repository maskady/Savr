import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStripe, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { Appearance } from 'react-native';
import { request } from '../utils/request';
import { APP_NAME } from '@env';
const StripePaymentForm = ({ orderId, onPaymentSuccess, onPaymentError }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === 'dark';
  
  const fetchPaymentSheetParams = async () => {
    try {
      // For testing, we're using hardcoded values since the endpoint isn't working
      console.log('Fetching payment sheet for order:', orderId);
      
      // REAL API CALL - Use this in production
      const { response, data } = await request(`/order/${orderId}/payment-sheet`, 'GET');

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

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      
      const params = await fetchPaymentSheetParams();
      console.log('Payment sheet params:', JSON.stringify(params, null, 2));
      
      if (!params) {
        setLoading(false);
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
        allowsDelayedPaymentMethods: true,
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
      setLoading(true);
      const { error, paymentOption } = await presentPaymentSheet();
      console.log('Payment option:', paymentOption, error);
      
      if (error) {
        console.error('Payment sheet error:', error);
        onPaymentError && onPaymentError(error.message);
      } else {
        console.log('Payment success with option:', paymentOption);
        onPaymentSuccess && onPaymentSuccess({ id: orderId });
      }
    } catch (error) {
      console.error('Error presenting payment sheet:', error);
      onPaymentError && onPaymentError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize even if orderId is not provided (using mock data in dev)
    initializePaymentSheet();
  }, []);

  return (
    <View style={styles.container}>
      
      <TouchableOpacity 
        style={[
          styles.payButton, 
          (!ready || loading) && styles.disabledButton
        ]} 
        disabled={!ready || loading}
        onPress={openPaymentSheet}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.payButtonText}>Pay Securely</Text>
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

export default StripePaymentForm; 