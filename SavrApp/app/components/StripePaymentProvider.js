import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { StripeProvider } from '@stripe/stripe-react-native';
import { request } from '../utils/request';

const StripePaymentProvider = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  const fetchPublishableKey = async () => {
    try {
      // You should implement an endpoint on your server to return the Stripe publishable key
      // This is a placeholder for the API call
      const { response, data } = await request('/payment/stripe/config', 'GET');
      
      if (response.ok && data && data.publishableKey) {
        setPublishableKey(data.publishableKey);
      } else {
        // Fallback to a test key when in development
        // IMPORTANT: Replace with your actual test key in development
        // and remove this fallback in production
        console.warn('Using fallback test key - replace in production!');
        setPublishableKey('pk_test_51O5qBdBLm9jMjKyY4XmEqWdbtKA7UTR3vAYcLxpHegv0ieLiZr3pQ7qXxvHb6VHBUYSYb7AvxUiqzB8RnYrlEYBw00x2XF6GaC');
      }
    } catch (error) {
      console.error('Failed to fetch publishable key:', error);
      // Use test key as fallback
      setPublishableKey('pk_test_51O5qBdBLm9jMjKyY4XmEqWdbtKA7UTR3vAYcLxpHegv0ieLiZr3pQ7qXxvHb6VHBUYSYb7AvxUiqzB8RnYrlEYBw00x2XF6GaC');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  if (loading) {
    return (
      <View style={styles.stripePaymentProvider.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.good2rescue.savr" // Replace with your Apple Pay merchant identifier
      urlScheme="savr" // Replace with your URL scheme for 3D Secure
    >
      {children}
    </StripeProvider>
  );
};

export default StripePaymentProvider; 