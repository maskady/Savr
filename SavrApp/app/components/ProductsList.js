// components/ProductsList.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

export default function ProductsList({
  products,
  editMode, // just in case you want to add editing later
  colors
}) {
  if (!products || products.length === 0) return null;

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Available Products</Text>
      {products.map((product, idx) => (
        <View
          key={idx}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          {product.image && (
            <Image source={{ uri: product.image }} style={styles.image} />
          )}
          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>
              {product.name}
            </Text>
            {product.description && (
              <Text style={[styles.desc, { color: colors.subtext }]}>
                {product.description}
              </Text>
            )}
            <View style={styles.prices}>
              {product.original_price != null && (
                <Text style={[styles.orig, { color: colors.subtext }]}>
                  €{product.original_price.toFixed(2)}
                </Text>
              )}
              <Text style={[styles.price, { color: colors.primary }]}>
                €{product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  desc: { fontSize: 14, marginBottom: 8 },
  prices: { flexDirection: 'row', alignItems: 'center' },
  orig: { fontSize: 14, textDecorationLine: 'line-through', marginRight: 8 },
  price: { fontSize: 16, fontWeight: 'bold' }
});