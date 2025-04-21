import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import QuantityCartButton from './QuantityCartButton';
import { useCart } from '../contexts/CheckoutContext';
import ProductDetailsModal from './ProductDetailsModal';


/**
 * Displays a list of all product variants for a given shop, summing availability.
 * Props:
 *   - shopId: number (required)
 *   - onItemPress: function(productVariant) (optional)
 */
export default function ShopProductList({ shopId, onItemPress, variants, setVariants }) {
  const { 
    cartItems,
    addToCart,
    removeFromCart,
  } = useCart();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const QuantityButton = (item) => {
    const shopCart = cartItems.find(cart => cart.shopId === item.shopId);
    const matchingItem = shopCart?.items.find(i => i.id === item.id);
    const quantityInCart = matchingItem?.quantity || 0;
    return (
      <QuantityCartButton 
        initialQuantity={quantityInCart}
        maxQuantity={item.initialStock}
        onQuantityChange={(increment) => handleQuantityChange(item, increment)}
      />
    )
  };

  const handleQuantityChange = (item, increment) => {
    if (increment) {
      addToCart(item);
    } else {
      removeFromCart(item.shopId, item.id);
    }
  
    setVariants(prevVariants =>
      prevVariants.map(variant => {
        if (variant.id === item.id && variant.shopId === item.shopId) {
          const toAdd = increment ? 1 : -1;
          
          return {
            ...variant,
            quantity: variant.quantity - toAdd,
          };
        }
        return variant;
      })
    );
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
    

    return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleItemPress(item)}
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
          {QuantityButton(item)}
        </View>
      </View>
    </TouchableOpacity>
  )};

  return (
    <>
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
        keyExtractor={(item) => item.id?.toString()}
      />

      {selectedItem && (
        <ProductDetailsModal
          item={selectedItem}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            // Optionnel: ajouter un délai avant de réinitialiser l'élément sélectionné
            setTimeout(() => setSelectedItem(null), 3000);
          }}
          quantityButton={QuantityButton(selectedItem)}
        />
      )}
    </>
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