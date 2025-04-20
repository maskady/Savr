import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { getAvailableProductVariantsForShop } from '../utils/api';
import { COLORS } from '../constants/colors';

/**
 * Displays a list of all product variants for a given shop, summing availability.
 * Props:
 *   - shopId: number (required)
 *   - onItemPress: function(productVariant) (optional)
 */
export default function ShopProductList({ shopId, onItemPress, variants, setVariants }) {
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onItemPress && onItemPress(item)}>
      <View style={styles.itemRow}>
        <Text style={styles.productName}>{item.productname}</Text>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Text style={styles.price}>{item.price}€</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={variants}
      ListHeaderComponent={() => (
        <View style={styles.listHeader}>
          <Text style={styles.textListHeader}>Available Products</Text>
          {/* any other header content */}
        </View>
      )}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <Text style={styles.empty}>No products available atm</Text>
      )}
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
    padding: 0, 
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.border,
    paddingBottom: 0,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 4
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', padding: 16 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  listHeader: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textListHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: COLORS.text,
  },
});
