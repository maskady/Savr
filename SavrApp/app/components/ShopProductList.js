import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Appearance } from 'react-native';
import PropTypes from 'prop-types';
import getStyles from '../styles/AppStyles';
import COLORS from '../constants/colors';
import QuantityCartButton from './QuantityCartButton';
import { useCart } from '../contexts/CheckoutContext';
import ProductDetailsModal from './ProductDetailsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Displays a list of all product variants for a given shop, summing availability.
 * Props:
 *   - shopId: number (required)
 *   - onItemPress: function(productVariant) (optional)
 */
export default function ShopProductList({ shopId, onItemPress, variants, setVariants }) {

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  const { 
    cartItems,
    addToCart,
    removeFromCart,
  } = useCart();

  // Try to get an item from AsyncStorage
  // const getItemDetails = async () => {
  //   try {
  //     const itemDetails = await AsyncStorage.getItem('selectedItem');
  //     if (itemDetails !== null) {
  //       const parsedItem = JSON.parse(itemDetails);
  //       console.log('Item details retrieved from AsyncStorage:', parsedItem);
  //       return parsedItem;
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving item details from AsyncStorage:', error);
  //   }
  // };
  // 
  // useEffect(() => {
  //   getItemDetails()
  //     .then(item => {
  //       if (item) {
  //         setSelectedItem(item);
  //         setModalVisible(true);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error in useEffect:', error);
  //     });
  // }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const QuantityButton = ({ item }) => {
    const shopCart = cartItems.find(cart => cart.shopId === item.shopId);
    const matchingItem = shopCart?.items.find(i => i.id === item.id);
    const quantityInCart = matchingItem?.quantity || 0;
    return (
      <QuantityCartButton 
        initialQuantity={quantityInCart}
        maxQuantity={item.initialStock}
        onQuantityChange={(increment) => handleQuantityChange(item, increment)}
      />
    );
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
    // Store in AsyncStorage this information

    const storeItemDetails = async (item) => {
      try {
        const itemDetails = JSON.stringify(item);
        await AsyncStorage.setItem('selectedItem', itemDetails);
        console.log('Item details stored in AsyncStorage');
      } catch (error) {
        console.error('Error storing item details in AsyncStorage:', error);
      }
    };

    storeItemDetails(item);

  };

  const renderItem = ({ item }) => {
    //console.log(`Item: ${JSON.stringify(item, null, 2)}`);
    

    return (
    <TouchableOpacity 
      style={styles.shopProductList.card}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.shopProductList.cardContent}>
        <View style={styles.shopProductList.productInfo}>
          <Text style={styles.shopProductList.productName}>{item.productName}</Text>
          <Text style={styles.shopProductList.productDescription} numberOfLines={1}>{item.productDescription}</Text>
          <View style={styles.shopProductList.priceContainer}>
            {item.originalPrice ? (
              <Text style={styles.shopProductList.originalPrice}>{item.originalPrice}€</Text>
            ) : null}
            <Text style={styles.shopProductList.price}>{item.price}€</Text>
            <Text style={styles.shopProductList.quantity}>Stock: {item.quantity}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <QuantityButton item={item} />
        </View>
      </View>
    </TouchableOpacity>
  )};

  return (
    <>
      <FlatList
        data={variants}
        ListHeaderComponent={() => (
          <View style={styles.shopProductList.listHeader}>
            <Text style={styles.shopProductList.textListHeader}>Available Products</Text>
          </View>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.shopProductList.list}
        ItemSeparatorComponent={() => <View style={styles.shopProductList.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.shopProductList.empty}>No products available atm</Text>
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
          quantityButton={<QuantityButton item={selectedItem} />}
        />
      )}
    </>
  );
}

ShopProductList.propTypes = {
  shopId: PropTypes.number.isRequired,
  onItemPress: PropTypes.func,
  variants: PropTypes.array.isRequired,
};

