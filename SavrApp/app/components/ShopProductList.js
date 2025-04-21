import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { getAvailableProductVariantsForShop } from '../utils/api';
import { COLORS } from '../constants/colors';
import QuantityCartButton from './QuantityCartButton';
import { useCart } from '../contexts/CheckoutContext';


/**
 * Displays a list of all product variants for a given shop, summing availability.
 * Props:
 *   - shopId: number (required)
 *   - onItemPress: function(productVariant) (optional)
 */
// TODO: Set good quantity on loading
export default function ShopProductList({ shopId, onItemPress, variants, setVariants }) {

  const { 
    cartItems,
    addToCart,
    removeFromCart,
  } = useCart();
  
  const handleQuantityChange = (item, newQuantity, increment) => {
    console.log('Is increment:', increment);
    if (increment) {
      console.log('Adding to cart:');
      addToCart(item);
    } else {
      console.log('Removing from cart:');
      removeFromCart(item.shopId, item.id);
    }

    console.log(`Cart: ${JSON.stringify(cartItems, null, 2)}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onItemPress && onItemPress(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productDescription} numberOfLines={1}>{item.productDescription}</Text>
          <View style={styles.priceContainer}>
            {item.originalPrice ? (
              <Text style={styles.originalPrice}>{item.originalPrice}€</Text>
            ) : null}
            <Text style={styles.price}>{item.price}€</Text>
            <Text style={styles.quantity}>Stock: {item.quantity}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <QuantityCartButton 
            initialQuantity={item.quantityInCart || 0}
            maxQuantity={item.quantity} // Assuming max quantity is the available stock
            onQuantityChange={(newQuantity, increment) => handleQuantityChange(item, newQuantity, increment)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={variants}
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.textListHeader}>Available Products</Text>
        </View>
      )}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <Text style={styles.empty}>No products available atm</Text>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

ShopProductList.propTypes = {
  shopId: PropTypes.number.isRequired,
  onItemPress: PropTypes.func,
  variants: PropTypes.array.isRequired,
  setVariants: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  list: { 
    padding: 8, 
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    paddingBottom: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  quantity: {
    fontSize: 13,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  loading: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  error: { 
    color: 'red', 
    padding: 16 
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 32, 
    fontSize: 16 
  },
  listHeader: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  textListHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: COLORS.text,
  },
});