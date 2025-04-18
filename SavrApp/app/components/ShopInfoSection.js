// components/ShopInfoSection.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';
import { Star } from 'lucide-react-native';
import { businessCategories } from '../constants/businessCategories';
import { useNavigation } from '@react-navigation/native';

export default function ShopInfoSection({
  shop,
  editMode,
  colors,
  primaryCategoryName,
  user,
  onInputChange
}) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {editMode === 'view' ? (
        <>
          <Text style={[styles.name, { color: colors.text }]}>
            {shop.name}
          </Text>
          {shop.rating != null && (
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= Math.round(shop.rating) ? colors.primary : 'none'}
                  color={i <= Math.round(shop.rating) ? colors.primary : colors.subtext}
                />
              ))}
              <Text style={[styles.ratingText, { color: colors.subtext }]}>
                {shop.rating.toFixed(1)} ({shop.ratings || 0})
              </Text>
            </View>
          )}
          {primaryCategoryName && (
            <Text style={[styles.category, { color: colors.subtext }]}>
              {primaryCategoryName}
            </Text>
          )}
          {/* If roleId >= 'shop' then show "Post New Product" Button*/}
          {user?.roleId != 'user' && ( 
              <TouchableOpacity
                style={[styles.postButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('PostProduct', { shopId: shop.id })}
              >
                <Text style={styles.buttonText}>Post New Product</Text>
              </TouchableOpacity>
            )}
        </>
      ) : (
        <>
          <TextInput
            style={[styles.nameInput, { borderColor: colors.border, color: colors.text }]}
            value={shop.name}
            onChangeText={text => onInputChange('name', text)}
            placeholder="Shop Name"
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.label, { color: colors.subtext }]}>
            Shop Name (displayed to customers)
          </Text>

          <TouchableOpacity
            style={[styles.dropdownTrigger, { borderColor: colors.border }]}
            onPress={() => setShowCategoryDropdown(true)}
          >
            <Text style={{ color: colors.text }}>
              {businessCategories[shop.primaryCategory]?.name || 'Select Category'}
            </Text>
          </TouchableOpacity>
          {showCategoryDropdown && (
            <Modal
              transparent
              animationType="fade"
              onRequestClose={() => setShowCategoryDropdown(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowCategoryDropdown(false)}
              >
                <View style={styles.dropdownMenu}>
                  {Object.entries(businessCategories).map(([key, cat]) => (
                    <TouchableOpacity
                      key={key}
                      style={styles.dropdownItem}
                      onPress={() => {
                        onInputChange('primaryCategory', key);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24,  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { marginLeft: 8, fontSize: 14 },
  category: { fontSize: 16, marginBottom: 16 },
  postButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  postText: { color: '#fff', fontWeight: 'bold' },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8
  },
  label: { fontSize: 12, marginTop: 4, marginBottom: 12 },
  dropdownTrigger: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    width: 250,
    borderRadius: 4,
    maxHeight: 300
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12
  }
});