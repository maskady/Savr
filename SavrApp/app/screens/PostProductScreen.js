// TODO: Refactor styles
import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SettingsContext } from '../contexts/SettingsContext';
import { getShopProducts, postProduct, postProductVariant, updateProduct } from '../utils/api';
import {COLORS} from '../constants/colors';
import CategoryDropdown from '../components/CategoryDropdown';
import ImageManager from '../components/ImageManager';


const PostProductScreen = () => {
  const route = useRoute();
  const shop = route.params?.shop || {};
  const setVariants = route.params?.setVariants || (() => {});
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopProducts, setShopProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Check if shop exists
    if (!shop) {
      Alert.alert('Error', 'Shop not found. Please select a valid shop.');
      navigation.goBack();
      return;
    }

    // Fetch shop products
    const fetchShopProducts = async () => {
      const products = await getShopProducts(shop?.id);
      setShopProducts(products);
    }
    fetchShopProducts();
  }, []);

  const onImagesChange = (newImages) => {
    setImages(newImages);
  }

  const onNameChange = (text) => {
    setName(text);
    const filtered = shopProducts.filter(p =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectProduct = (product) => {
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price?.toString() || '');
    setOriginalPrice(product.originalPrice?.toString() || '');
    setCategory(product.categories?.[0] || '');
    setImages(product.images || []);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!name || !originalPrice || !price || !quantity || !description) {
      Alert.alert('Validation', 'Name, description, price, and quantity are required.');
      return;
    }
    setLoading(true);

    try {
      const productToPost = {
        name,
        description,
        originalPrice: parseFloat(originalPrice),
        price: parseFloat(price),
        shopId: shop?.id,
        categories: [category],
        images: images,
      };
  
      // Determine whether to create or update the product
      let productId = null;
      const existing = shopProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
      let productResponse;
      if (existing) {
        console.log('[PostProductScreen] Updating product with data:', productToPost);
        await updateProduct(existing.id, productToPost);
        productId = existing.id;

      } else {
        console.log('[PostProductScreen] Posting product with data:', productToPost);
        productResponse = await postProduct(productToPost);
        productId = productResponse.id;
      }
      console.log("Product ID", productId);
      const productVariantToPost = {
        ...productToPost,
        productId: productId,
        originalPrice: parseFloat(originalPrice),
        price: parseFloat(price),
        quantity: quantity,
        isActive: true,
      }
      console.log('[PostProductScreen] Posting product variant with data:', productVariantToPost);
      const productVariantResponse = await postProductVariant(productVariantToPost);
      const productVariantId = productVariantResponse.data.id;
      console.log("New Product Variant ID", productVariantId);

      // update variants state (simply append productVariantToPost)
      setVariants(prevVariants => [
        ...prevVariants,
        {
          ...productVariantToPost,
          ...productToPost,
          id: productVariantId,
        }]);

      Alert.alert('Success', 'Product posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('[PostProductScreen] Error posting product:', err);
      Alert.alert('Error', 'Failed to post product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onCategoryInputChange = (key, value) => {
    setCategory(value);
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel?', [
      {
        text: 'Yes',
        onPress: () => navigation.goBack(),
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  }

  const colors = COLORS;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {/** Cancel button */}
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.secondary }]}
        // replace above line by style={[styles.cancelButton, { backgroundColor: isDarkMode ? COLORS.primaryDark : COLORS.primary }]}
        onPress={handleCancel}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Cancel</Text>
        )}

      {/** Product Name */}
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.text }]}>Product Name *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={name}
        onChangeText={onNameChange}
        placeholder="Enter product name"
        placeholderTextColor={colors.placeholder}
        returnKeyType='default'
      />
      {showSuggestions && suggestions.length > 0 && (
        <ScrollView
          style={styles.suggestionsContainer}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {suggestions.map(product => (
            <TouchableOpacity
              key={product.id}
              onPress={() => handleSelectProduct(product)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>{product.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/** Description */}
      <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          { backgroundColor: colors.inputBg, borderColor: colors.border },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter a short description"
        placeholderTextColor={colors.placeholder}
        multiline
        numberOfLines={4}
        returnKeyType='default'
      />

      {/** Original Price */}
      <Text style={[styles.label, { color: colors.text }]}>Original Price *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={originalPrice}
        onChangeText={setOriginalPrice}
        placeholder="0.00"
        placeholderTextColor={colors.placeholder}
        keyboardType="decimal-pad"
        returnKeyType='done'
      />

      {/** Price */}
      <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        placeholderTextColor={colors.placeholder}
        keyboardType="decimal-pad"
        returnKeyType='done'
      />

      {/** Quantity */}
      <Text style={[styles.label, { color: colors.text }]}>Quantity *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={quantity.toString()}
        onChangeText={(text) => {
          console.log("Quantity", text);
          if (text === '') {
            setQuantity('');
          } else {
            setQuantity(parseInt(text))
          }
          
        }}
        placeholder="Enter quantity"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
        returnKeyType='done'
      />

      {/** Category */}
      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <CategoryDropdown shop={shop} onInputChange={onCategoryInputChange} category={category} />

      {/** Image Picker */}
      <Text style={[styles.label, { color: colors.text }]}>Image</Text>
      <ImageManager
        images={images}
        height={250}
        editMode={'edit'}
        onImagesChange={onImagesChange}
        onImagePress={() => {}}
        
      />

      {/** Submit button*/}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Post Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    width: '30%',
    alignSelf: 'flex-end',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    marginTop: 8,
    height: 200,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 150,
    marginBottom: 8,
  },
  suggestionItem: {
    padding: 12,
  },
  suggestionText: {
    fontSize: 16,
  },
});

export default PostProductScreen;