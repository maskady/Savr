// components/FullScreenImageModal.js
import React, {useEffect, useState} from 'react';
import { Modal, View, TouchableOpacity, Image, Appearance } from 'react-native';
import getStyles from '../styles/AppStyles';
import { ArrowLeft } from 'lucide-react-native';

export default function FullScreenImageModal({ image, onClose }) {
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  
  
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