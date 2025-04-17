// components/FullScreenImageModal.js
import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function FullScreenImageModal({ image, onClose }) {
  return (
    <Modal visible={!!image} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image.url }} style={styles.image} resizeMode="contain"/>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.9)', justifyContent:'center', alignItems:'center' },
  closeBtn: { position:'absolute', top:40, left:20, padding:10, zIndex:10 },
  image: { width:'100%', height:'80%' },
});