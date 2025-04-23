import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URI } from '@env';
import getToken from '../utils/token';

const imageUploadUrl = `${API_URI}/image/upload`;

export default function useImageUpload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant gallery access!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select an image first.');
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: `upload-${Date.now()}.jpg`,
      type: 'image/jpeg',
    });

    try {
      const token = await getToken();

      const response = await axios.post(imageUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Image upload response:', response.data);

      Alert.alert('Success', 'Image uploaded successfully');
      return response.data.fileUrl;
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.response?.data?.message || error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { image, uploading, pickImage, uploadImage };
}
