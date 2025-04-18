// components/ShopContent.js
import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import ImageManager from './ImageManager'; // adjust path
import ShopInfoSection from './ShopInfoSection';
import ShopDescription from './ShopDescription';
import ContactSection from './ContactSection';
import ShopMapSection from './ShopMapSection';
import ProductsList from './ProductsList';

export default function ShopContent({
  shop, loading, error, editMode, colors, primaryCategoryName,
  user, onCall, onNavigate, onInputChange, onImagesChange, onImagePress
}) {
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
        <Text style={{ color:colors.text }}>{error}</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onNavigate}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
        editMode={editMode}
        colors={colors}
        primaryCategoryName={primaryCategoryName}
        user={user}
        onInputChange={onInputChange}
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

      <ProductsList
        products={shop.products}
        editMode={editMode}
        colors={colors}
      />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  button: { padding:12, borderRadius:8, marginTop:16 },
  buttonText: { color:'#fff', fontWeight:'bold' },
}); 