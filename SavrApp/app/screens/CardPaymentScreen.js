import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/CardPaymentScreenStyles';
import { useCart } from '../contexts/CheckoutContext';

const CardPaymentScreen = ({ route }) => {
  const { amount = 0 } = route.params || {};
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const { cartItems } = useCart();
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const formatCardNumber = (text) => {
    return text
      .replace(/\D/g, '')      
      .slice(0, 16)             
      .match(/.{1,4}/g)         
      ?.join(' ') || '';        
  };
  
  const handleCardNumberChange = (text) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  
    const unformattedLength = formatted.replace(/\s/g, '').length;
    if (unformattedLength < 16) {
      setErrors(prev => ({ ...prev, cardNumber: 'The card number must be 16 digits' }));
    } else {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };
  
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const trimmed = cleaned.slice(0, 4);
    if (trimmed.length > 2) {
      return trimmed.slice(0, 2) + '/' + trimmed.slice(2);
    }
    return trimmed;
  };
  
  const handleExpiryDateChange = (text) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
    
    if (formatted.length < 5) {
      setErrors(prev => ({...prev, expiryDate: 'MM/YY format required'}));
    } else {
      const month = parseInt(formatted.slice(0, 2));
      if (month < 1 || month > 12) {
        setErrors(prev => ({...prev, expiryDate: 'Month must be between 01 and 12'}));
      } else {
        setErrors(prev => ({...prev, expiryDate: ''}));
      }
    }
  };
  
  const handleCvvChange = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    setCvv(cleaned);
    
    if (cleaned.length < 3) {
      setErrors(prev => ({...prev, cvv: 'CVV must be 3 digits'}));
    } else {
      setErrors(prev => ({...prev, cvv: ''}));
    }
  };
  
  const handleNameChange = (text) => {
    setCardholderName(text);
    
    if (text.trim().length < 3) {
      setErrors(prev => ({...prev, cardholderName: 'Name must be at least 3 characters'}));
    } else {
      setErrors(prev => ({...prev, cardholderName: ''}));
    }
  };
  
  const getCardType = () => {
    const number = cardNumber.replace(/\s/g, '');
    
    if (number.startsWith('4')) {
      return 'visa';
    } else if (/^5[1-5]/.test(number)) {
      return 'cc-mastercard';
    } else if (/^3[47]/.test(number)) {
      return 'cc-amex';
    } else {
      return 'credit-card';
    }
  };
  
  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardholderName.trim().length >= 3 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      !Object.values(errors).some(error => error)
    );
  };
  
  const handlePayment = () => {
    console.log('Cart Items:', cartItems);
    if (!isFormValid()) {
      Alert.alert(
        "Form invalid",
        "Please fill all fields correctly.",
        [{ text: "OK" }]
      );
      return;
    }
    
    Alert.alert(
      "Payment in progress",
      "Please wait while we process your payment.",
      []
    );

    // Request to the api to process the payment
    
    
    Alert.alert(
      "Payment successful",
      "Your payment of " + amount.toFixed(2) + " € has been processed successfully.",
      [{ text: "OK", onPress: () => navigation.navigate('Home') }]
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={20} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
              Secure Payment
            </Text>
          </View>
          
          <View style={[styles.amountCard, isDark ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.amountLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              Amount to pay
            </Text>
            <Text style={[styles.amountValue, isDark ? styles.darkText : styles.lightText]}>
              {amount.toFixed(2)} €
            </Text>
          </View>
          
          <View style={[styles.cardForm, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark ? styles.darkText : styles.lightText]}>
                Card Number
              </Text>
              <View style={styles.cardNumberContainer}>
                <TextInput
                  style={[
                    styles.input, 
                    isDark ? styles.darkInput : styles.lightInput,
                    errors.cardNumber ? styles.inputError : null
                  ]}
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                  maxLength={19} 
                />
                {cardNumber.length > 0 && (
                  <FontAwesome 
                    name={getCardType()} 
                    size={24} 
                    color={isDark ? "#fff" : "#000"}
                    style={styles.cardIcon}
                  />
                )}
              </View>
              {errors.cardNumber ? (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              ) : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark ? styles.darkText : styles.lightText]}>
                Name on the card
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  isDark ? styles.darkInput : styles.lightInput,
                  errors.cardholderName ? styles.inputError : null
                ]}
                value={cardholderName}
                onChangeText={handleNameChange}
                placeholder="Full Name"
                placeholderTextColor={isDark ? "#666" : "#999"}
                autoCapitalize="characters"
              />
              {errors.cardholderName ? (
                <Text style={styles.errorText}>{errors.cardholderName}</Text>
              ) : null}
            </View>
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, isDark ? styles.darkText : styles.lightText]}>
                  Expiration Date
                </Text>
                <TextInput
                  style={[
                    styles.input, 
                    isDark ? styles.darkInput : styles.lightInput,
                    errors.expiryDate ? styles.inputError : null
                  ]}
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  placeholder="MM/YY"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.expiryDate ? (
                  <Text style={styles.errorText}>{errors.expiryDate}</Text>
                ) : null}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, isDark ? styles.darkText : styles.lightText]}>
                  CVV
                </Text>
                <TextInput
                  style={[
                    styles.input, 
                    isDark ? styles.darkInput : styles.lightInput,
                    errors.cvv ? styles.inputError : null
                  ]}
                  value={cvv}
                  onChangeText={handleCvvChange}
                  placeholder="123"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv ? (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                ) : null}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveCardOption}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[
                styles.checkbox, 
                saveCard ? styles.checkboxChecked : null,
                isDark ? styles.darkCheckbox : styles.lightCheckbox
              ]}>
                {saveCard && (
                  <FontAwesome name="check" size={12} color="#FFF" />
                )}
              </View>
              <Text style={[styles.saveCardText, isDark ? styles.darkText : styles.lightText]}>
                Save my card for future payments
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.securityInfo, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.securityHeader}>
              <FontAwesome name="lock" size={16} color={isDark ? "#8BC34A" : "#4CAF50"} />
              <Text style={[styles.securityTitle, isDark ? styles.darkText : styles.lightText]}>
                Secure Payment
              </Text>
            </View>
            <Text style={[styles.securityText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              All of your payment information is encrypted and securely processed. We do not store your card details.
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[styles.payButton, !isFormValid() && styles.payButtonDisabled, isDark && isFormValid() && styles.darkPayButton]}
            onPress={handlePayment}
            // disabled={!isFormValid()}
          >
            <Text style={[styles.payButtonText, isDark && styles.darkPayButtonText]}>
              Pay {amount.toFixed(2)} €
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CardPaymentScreen;