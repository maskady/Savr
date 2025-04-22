// components/ShopContent.js
import React, {useState, useEffect, useContext} from 'react';
import { Alert, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';
import ImageManager from './ImageManager'; // adjust path
import { getAvailableProductVariantsForShop } from '../utils/api';
import ShopInfoSection from './ShopInfoSection';
import ShopDescription from './ShopDescription';
import ContactSection from './ContactSection';
import ShopMapSection from './ShopMapSection';
import ShopProductList from './ShopProductList';

export default function ShopContent({
  shop, variants, setVariants, loading, setLoading, error, setError, editMode, colors, primaryCategoryName,
  user, onCall, onNavigate, onInputChange, onImagesChange, onImagePress
}) {

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchVariants = async () => {
      setLoading(true);
      try {
        const response = await getAvailableProductVariantsForShop(
          shop.id
        );
        if (!isMounted) return;
        if (response.data && Array.isArray(response.data)) {
          // Add a new field in each variant object to store the initial stock
          const updatedVariants = response.data.map(variant => ({
            ...variant,
            initialStock: variant.quantity,
          }));
          setVariants(updatedVariants);
        } else {
          setVariants([]);
        }
      } catch (err) {
        console.error('Failed to load product variants:', err);
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVariants();
    return () => { isMounted = false; };
  }, [shop.id]);

  if (loading) {
    return (
      <View style={styles.shopContent.center}>
        <ActivityIndicator size="large" color={isDarkMode ? COLORS.primaryDark : COLORS.primary}/>
        <Text style={[styles.shopContent.loadingText, { color: colors.text }]}>Loading shop details…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.shopContent.center}>
        <Text style={[styles.shopContent.errorText, { color: colors.text }]}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
        <TouchableOpacity style={[styles.shopContent.button, { backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary }]} onPress={onNavigate}>
          <Text style={styles.shopContent.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={() => (
        <>
          <ImageManager
            images={shop.images}
            height={250}
            editMode={editMode}
            onImagesChange={onImagesChange}
            onImagePress={onImagePress}
          />
          <View style={styles.shopContent.containerPadding}>

            <ShopInfoSection
              shop={shop}
              setVariants={setVariants}
              variants
              editMode={editMode}
              colors={colors}
              primaryCategoryName={primaryCategoryName}
              user={user}
              onInputChange={onInputChange}
            />

            <ShopProductList 
              shopId={shop.id} 
              onItemPress={() => {Alert.alert("Item selected")}} 
              variants={variants} 
              setVariants={setVariants}
            />

            <ShopDescription
              description={shop.description}
              editMode={editMode}
              onChange={text => onInputChange('description', text)}
              colors={colors}
            />

            <ContactSection
              shop={shop}
              editMode={editMode}
              onCall={onCall}
              onNavigate={onNavigate}
              onInputChange={onInputChange}
              colors={colors}
            />

            <ShopMapSection
              latitude={shop.latitude}
              longitude={shop.longitude}
              name={shop.name}
              onNavigate={onNavigate}
              colors={colors}
            />
          </View>
        </>
      )}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}
