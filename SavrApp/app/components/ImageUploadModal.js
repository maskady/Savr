// components/ImageUploadModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';
import useImageUpload from '../hooks/useImageUpload';
import { Camera, Upload, X } from 'lucide-react-native';

export default function ImageUploadModal({ visible, onClose, onUploadSuccess }) {
  const styles = getStyles();
  const { image, uploading, pickImage, uploadImage } = useImageUpload();

  const handleUpload = async () => {
    const fileUrl = await uploadImage();
    if (fileUrl) {
      onUploadSuccess({ fileUrl });
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.imageUploadModal.modalBackground}>
        <View style={styles.imageUploadModal.modalContainer}>
          <TouchableOpacity 
            style={styles.imageUploadModal.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.imageUploadModal.modalTitle}>Upload Image</Text>
          
          {image ? (
            <View style={styles.imageUploadModal.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.imageUploadModal.imagePreview} />
            </View>
          ) : (
            <View style={styles.imageUploadModal.imagePlaceholder}>
              <Camera size={50} color="#aaa" />
              <Text style={styles.imageUploadModal.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.imageUploadModal.buttonContainer}>
            <TouchableOpacity 
              style={styles.imageUploadModal.actionButton} 
              onPress={pickImage}
            >
              <View style={styles.imageUploadModal.buttonContent}>
                <Camera size={18} color="#fff" style={styles.imageUploadModal.buttonIcon} />
                <Text style={styles.imageUploadModal.buttonText}>Select Image</Text>
              </View>
            </TouchableOpacity>

            {uploading ? (
              <View style={[styles.imageUploadModal.actionButton, styles.imageUploadModal.uploadButton]}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.imageUploadModal.buttonText, {marginLeft: 10}]}>Uploading...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.imageUploadModal.actionButton, styles.imageUploadModal.uploadButton, !image && styles.imageUploadModal.disabledButton]} 
                onPress={handleUpload}
                disabled={!image}
              >
                <View style={styles.imageUploadModal.buttonContent}>
                  <Upload size={18} color="#fff" style={styles.imageUploadModal.buttonIcon} />
                  <Text style={styles.imageUploadModal.buttonText}>Upload</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}