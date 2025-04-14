// components/ImageUploadModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import useImageUpload from '../hooks/useImageUpload';
import { Camera, Upload, X } from 'lucide-react-native';

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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Upload Image</Text>
          
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={50} color="#aaa" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={pickImage}
            >
              <View style={styles.buttonContent}>
                <Camera size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Select Image</Text>
              </View>
            </TouchableOpacity>

            {uploading ? (
              <View style={[styles.actionButton, styles.uploadButton]}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.buttonText, {marginLeft: 10}]}>Uploading...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.uploadButton, !image && styles.disabledButton]} 
                onPress={handleUpload}
                disabled={!image}
              >
                <View style={styles.buttonContent}>
                  <Upload size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Upload</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 240,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
    marginHorizontal: 5,
  },
  uploadButton: {
    backgroundColor: 'rgba(46,125,50,0.9)',
  },
  disabledButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});