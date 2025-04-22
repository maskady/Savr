// components/ShopInfoSection.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Appearance
} from 'react-native';
import { Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import CategoryDropdown from './CategoryDropdown';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';

export default function ShopInfoSection({
  shop,
  setVariants,
  editMode,
  primaryCategoryName,
  user,
  onInputChange
}) {
  const navigation = useNavigation();
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.shopInfoSection.container}>
      {editMode === 'view' ? (
        <>
          <Text style={styles.shopInfoSection.name}>
            {shop.name}
          </Text>
          {shop.rating != null && (
            <View style={styles.shopInfoSection.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= Math.round(shop.rating) ? styles.shopInfoSection.fillColorTrue : styles.shopInfoSection.fillColorFalse}
                  color={i <= Math.round(shop.rating) ? styles.shopInfoSection.fillColorTrue : styles.shopInfoSection.fillColorFalse}
                />
              ))}
              <Text style={styles.shopInfoSection.ratingText}>
                {shop.rating.toFixed(1)} ({shop.ratings || 0})
              </Text>
            </View>
          )}
          {primaryCategoryName && (
            <Text style={styles.shopInfoSection.category}>
              {primaryCategoryName}
            </Text>
          )}
          {/* If roleId >= 'shop' then show "Post New Product" Button*/}
          {user?.roleId != 'user' && ( 
              <TouchableOpacity
                style={styles.shopInfoSection.postButton}
                onPress={() => navigation.navigate('PostProduct', { shop: shop, setVariants: setVariants })}
                >
                <Text style={styles.shopInfoSection.postButtonText}>Post New Product</Text>
              </TouchableOpacity>
            )}
        </>
      ) : (
        <>
          <TextInput
            style={styles.shopInfoSection.nameInput}
            value={shop.name}
            onChangeText={text => onInputChange('name', text)}
            placeholder="Shop Name"
          />
          <Text style={styles.shopInfoSection.label}>
            Shop Name (displayed to customers)
          </Text>

          <CategoryDropdown shop={shop} onInputChange={onInputChange} />
        </>
      )}
    </View>
  );
}
