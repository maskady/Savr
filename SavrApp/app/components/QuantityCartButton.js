import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 


const QuantityCartButton = ({ onQuantityChange, initialQuantity = 0, maxQuantity = 99 }) => {
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
      
      // Si la quantité devient 0, retourner à l'état initial
      if (newQuantity === 0) {
        setIsInCart(false);
      }
    }
  };

  if (!isInCart) {
    // Afficher le bouton d'ajout au panier avec l'icône de caddy
    return (
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <FontAwesome name="shopping-cart" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    );
  } else {
    // Afficher le contrôle de quantité
    return (
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.quantityTextContainer}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        
        <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quantityTextContainer: {
    minWidth: 32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuantityCartButton;