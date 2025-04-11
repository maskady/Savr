import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert
} from 'react-native';
import ImageGallery from './ImageGallery';
import ImageUploadModal from './ImageUploadModal';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react-native';

/**
 * ImageManager component that combines ImageGallery with image upload, delete and reordering capabilities
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of image objects with url, alt, and type properties
 * @param {function} props.onImagesChange - Callback when images are added, removed or reordered
 * @param {string} props.editMode - Current edit mode ('view', 'edit', 'saving')
 * @param {number} props.height - Height of the gallery (default: 250)
 * @param {boolean} props.showIndicators - Whether to show pagination indicators (default: true)
 * @param {function} props.onImagePress - Callback when an image is pressed in view mode
 */
const ImageManager = ({
  images = [],
  onImagesChange,
  editMode = 'view',
  height = 250,
  showIndicators = true,
  onImagePress
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Handle image upload success
  const handleUploadSuccess = ({ fileUrl }) => {
    // Remove placeholder images when adding a new image
    const nonPlaceholderImages = images.filter(image => image.type !== 'placeholder');
    
    // Add the new image
    const updatedImages = [
      ...nonPlaceholderImages,
      { url: fileUrl, alt: 'Uploaded Image', type: 'uploaded' }
    ];
    
    // Notify parent component of the change
    onImagesChange(updatedImages);
  };

  // Handle image deletion
  const handleDeleteImage = (index) => {
    Alert.alert(
      "Delete Image",
      "Are you sure you want to delete this image?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const updatedImages = [...images];
            updatedImages.splice(index, 1);
            
            // If no images left, add a placeholder
            if (updatedImages.length === 0) {
              updatedImages.push({
                url: 'https://via.placeholder.com/400x250?text=No+Images',
                alt: 'No images available',
                type: 'placeholder'
              });
            }
            
            onImagesChange(updatedImages);
            setSelectedImageIndex(null);
          }
        }
      ]
    );
  };

  // Handle image reordering
  const handleMoveImage = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return; // Can't move outside boundaries
    }

    const updatedImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap images
    [updatedImages[index], updatedImages[newIndex]] = 
    [updatedImages[newIndex], updatedImages[index]];
    
    onImagesChange(updatedImages);
    setSelectedImageIndex(newIndex); // Update selected index to follow the moved image
  };

  // Handle image selection for management
  const handleImagePress = (image, index) => {
    if (editMode === 'edit') {
      setSelectedImageIndex(index === selectedImageIndex ? null : index);
    } else if (onImagePress) {
      onImagePress(image);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image Gallery */}
      <ImageGallery
        images={images}
        height={height}
        showIndicators={showIndicators}
        onImagePress={handleImagePress}
      />

      {/* Image Management Controls in Edit Mode */}
      {editMode === 'edit' && (
        <>
          <Button 
            title="Add Image" 
            onPress={() => setModalVisible(true)} 
          />
          
          {selectedImageIndex !== null && images[selectedImageIndex]?.type !== 'placeholder' && (
            <View style={styles.imageControls}>
              <Text style={styles.controlsTitle}>
                Image Controls
              </Text>
              
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.controlButton, selectedImageIndex === 0 && styles.disabledButton]}
                  onPress={() => handleMoveImage(selectedImageIndex, 'up')}
                  disabled={selectedImageIndex === 0}
                >
                  <ArrowUp 
                    size={20} 
                    color={selectedImageIndex === 0 ? '#ccc' : '#333'} 
                  />
                  <Text style={styles.controlButtonText}>Move Up</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.controlButton, selectedImageIndex === images.length - 1 && styles.disabledButton]}
                  onPress={() => handleMoveImage(selectedImageIndex, 'down')}
                  disabled={selectedImageIndex === images.length - 1}
                >
                  <ArrowDown 
                    size={20} 
                    color={selectedImageIndex === images.length - 1 ? '#ccc' : '#333'} 
                  />
                  <Text style={styles.controlButtonText}>Move Down</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.controlButton, styles.deleteButton]}
                  onPress={() => handleDeleteImage(selectedImageIndex)}
                >
                  <Trash2 size={20} color="#d32f2f" />
                  <Text style={[styles.controlButtonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageControls: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  controlsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  controlButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});

export default ImageManager; 