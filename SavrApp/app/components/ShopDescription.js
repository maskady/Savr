// components/ShopDescription.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Appearance
} from 'react-native';
import getStyles from '../styles/AppStyles';
import COLORS from '../constants/colors';

export default function ShopDescription({
  description,
  editMode,
  onChange,
}) {
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  return (
    <View style={styles.shopDescription.container}>
      <Text style={styles.shopDescription.title}>Shop Description</Text>
      {editMode === 'view' ? (
        <Text style={styles.shopDescription.text}>
          {description || 'No description available for this shop.'}
        </Text>
      ) : (
        <>
          <TextInput
            style={styles.shopDescription.input}
            value={description}
            onChangeText={onChange}
            placeholder="Enter shop description"
            placeholderTextColor={COLORS.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.shopDescription.label}>
            Describe your shop to attract customers
          </Text>
        </>
      )}
    </View>
  );
}
