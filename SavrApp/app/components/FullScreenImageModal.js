// components/FullScreenImageModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Image } from 'react-native';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';
import { ArrowLeft } from 'lucide-react-native';

export default function FullScreenImageModal({ image, onClose }) {
  const styles = getStyles();
  return (
    <Modal visible={!!image} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.fullScreenImageModal.overlay}>
        <TouchableOpacity onPress={onClose} style={styles.fullScreenImageModal.closeBtn}>
          <ArrowLeft size={24} color={styles.fullScreenImageModal.icon.color} />
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image.url }} style={styles.fullScreenImageModal.image} resizeMode="contain"/>
        )}
      </View>
    </Modal>
  );
}