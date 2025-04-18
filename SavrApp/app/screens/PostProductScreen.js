// app/screens/PostProductScreen.js
import React, { useState, useContext } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { SettingsContext } from '../contexts/SettingsContext';
import { postProduct, postProductVariant } from '../utils/api';
import {COLORS} from '../constants/colors';
import CategoryDropdown from '../components/CategoryDropdown';
import ImageManager from '../components/ImageManager';

const PostProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const shop = route.params?.shop || {};

  // fetch products from the shop
  const shopProducts = null; // Replace with actual fetch logic from api - waiting for the backend to be ready

  const onImagesChange = (newImages) => {
    setImages(newImages);
  }

  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert('Validation', 'Name and price are required.');
      return;
    }
    setLoading(true);

    const dataToPost = {
      name,
      description,
      price: parseFloat(price),
      shopId: shop?.id,
      categories: [category],
      images: [],
      // [
      //   {
      //     url: ],
      //     alt: name,
      //     type: 'titleImage',
      //   },
      // ],

    };

    try {
      console.log('Posting product with data:', dataToPost);
      await postProduct(dataToPost); // Post product only if it does not exist - waiting for the backend to be ready
      await postProductVariant(dataToPost);
      console.log('Product posted successfully');

      Alert.alert('Success', 'Product posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Error posting product:', err);
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
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.secondary }]}
        onPress={handleCancel}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Cancel</Text>
        )}
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.text }]}>Product Name *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
        placeholderTextColor={colors.placeholder}
      />

      <Text style={[styles.label, { color: colors.text }]}>Description</Text>
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
      />

      <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        placeholderTextColor={colors.placeholder}
        keyboardType="decimal-pad"
      />

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <CategoryDropdown shop={shop} onInputChange={onCategoryInputChange} category={category} />

      <Text style={[styles.label, { color: colors.text }]}>Image</Text>
      {/* <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: colors.primary }}>Tap to choose an image</Text>
        )}
      </TouchableOpacity> */}
      <ImageManager
        images={images}
        height={250}
        editMode={'edit'}
        onImagesChange={onImagesChange}
        onImagePress={() => {}}
        
      />
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
});

export default PostProductScreen;