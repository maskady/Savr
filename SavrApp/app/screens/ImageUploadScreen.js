import React from 'react';
import { View, Button, Image, ActivityIndicator } from 'react-native';
import useImageUpload from '../hooks/useImageUpload';

export default function ImageUploadScreen() {
  const { image, uploading, pickImage, uploadImage } = useImageUpload();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
      
      <Button title="Pick an Image" onPress={pickImage} />

      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Upload Image" onPress={uploadImage} disabled={!image} />
      )}
    </View>
  );
}
