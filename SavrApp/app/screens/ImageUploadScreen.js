import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { IMAGE_URI } from '@env';
import { getToken } from '../utils/token';

const API_URL = `${IMAGE_URI}/api/image/upload`;

export default function ImageUploadScreen() {
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
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: `upload-${Date.now()}.jpg`,
      type: 'image/jpeg', // adjust type as necessary
    });

    try {
      const token = await getToken();
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', response.data.fileUrl);
      console.log(response.data.fileUrl);
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200, marginBottom: 20, borderRadius: 10 }}
        />
      )}

      <Button title="Pick an Image" onPress={pickImage} />

      <View style={{ height: 20 }} />

      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Upload Image" onPress={uploadImage} disabled={!image} />
      )}
    </View>
  );
}
