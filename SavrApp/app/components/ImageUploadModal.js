// components/ImageUploadModal.js
import React from 'react';
import { Modal, View, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import useImageUpload from '../hooks/useImageUpload';

export default function ImageUploadModal({ visible, onClose, onUploadSuccess }) {
  const { image, uploading, pickImage, uploadImage } = useImageUpload();

  const handleUpload = async () => {
    const fileUrl = await uploadImage();
    if (fileUrl) {
      onUploadSuccess({ fileUrl });
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

          <Button title="Pick an Image" onPress={pickImage} />

          {uploading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button title="Upload Image" onPress={handleUpload} disabled={!image} />
          )}

          <Button title="Cancel" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});