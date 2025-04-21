// components/ShopContent.js
import React, {useState, useEffect} from 'react';
import { Alert, View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
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
          setVariants(response.data);
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary}/>
        <Text style={{ color:colors.text, marginTop:12 }}>Loading shop details…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color:colors.text }}>
          {error instanceof Error ? error.message : String(error)}
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onNavigate}>
          <Text style={styles.buttonText}>Go Back</Text>
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
          <View style={{padding:16}}>

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

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  button: { padding:12, borderRadius:8, marginTop:16 },
  buttonText: { color:'#fff', fontWeight:'bold' },
});