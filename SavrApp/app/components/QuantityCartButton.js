import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { FontAwesome } from '@expo/vector-icons'; 


const QuantityCartButton = ({ onQuantityChange, initialQuantity = 0, maxQuantity = 99 }) => {
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInCart, setIsInCart] = useState(initialQuantity > 0);

  const handleAddToCart = () => {
    if (!isInCart) {
      const newQuantity = 1;
      setQuantity(newQuantity);
      setIsInCart(true);
      if (onQuantityChange) onQuantityChange(true);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      if (onQuantityChange) onQuantityChange(true);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (onQuantityChange) onQuantityChange(false);

      if (newQuantity === 0) {
        setIsInCart(false);
      }
    }
  };

  if (!isInCart) {
    return (
      <TouchableOpacity style={styles.quantityCartButton.addButton} onPress={handleAddToCart}>
        <FontAwesome name="shopping-cart" size={18} color={styles.quantityCartButton.quantityButtonText.color} />
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={styles.quantityCartButton.quantityContainer}>
        <TouchableOpacity style={styles.quantityCartButton.quantityButton} onPress={handleDecrement}>
          <Text style={styles.quantityCartButton.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.quantityCartButton.quantityTextContainer}>
          <Text style={styles.quantityCartButton.quantityText}>{quantity}</Text>
        </View>

        <TouchableOpacity style={styles.quantityCartButton.quantityButton} onPress={handleIncrement}>
          <Text style={styles.quantityCartButton.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
};


export default QuantityCartButton;