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
import { Trash2, ArrowUp, ArrowDown, Pencil, X, Camera, Edit, ArrowLeft, ArrowRight } from 'lucide-react-native';

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
      {/* Image Gallery with Overlay Button */}
      <View style={styles.galleryContainer}>
        <ImageGallery
          images={images}
          height={height}
          showIndicators={showIndicators}
          onImagePress={handleImagePress}
        />

        {editMode === 'edit' && (
          <>
            {/* Overlay Edit Button */}
            <TouchableOpacity 
              style={styles.overlayButton} 
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.buttonContent}>
                <Camera size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.overlayButtonText}>Add Photo</Text>
              </View>
            </TouchableOpacity>

            {/* Overlay Selection Button */}
            {images.length > 0 && (
              <TouchableOpacity
                style={[styles.overlayButton, styles.selectButton]}
                onPress={() => setSelectedImageIndex(selectedImageIndex === null ? 0 : null)}
              >
                <View style={styles.buttonContent}>
                  <Edit size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.overlayButtonText}>
                    {selectedImageIndex !== null ? 'Cancel' : 'Edit Photos'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Image Management Controls in Edit Mode */}
      {editMode === 'edit' && selectedImageIndex !== null && images[selectedImageIndex]?.type !== 'placeholder' && (
        <View style={styles.imageControls}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, selectedImageIndex === 0 && styles.disabledControlButton]}
              onPress={() => handleMoveImage(selectedImageIndex, 'down')}
              disabled={selectedImageIndex === 0}
            >
              <View style={styles.buttonContent}>
                <ArrowLeft 
                  size={18} 
                  color={selectedImageIndex === 0 ? '#aaa' : '#fff'} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.controlButtonText}>Move Left</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, selectedImageIndex === images.length - 1 && styles.disabledControlButton]}
              onPress={() => handleMoveImage(selectedImageIndex, 'up')}
              disabled={selectedImageIndex === images.length - 1}
            >
              <View style={styles.buttonContent}>
                <ArrowRight 
                  size={18} 
                  color={selectedImageIndex === images.length - 1 ? '#aaa' : '#fff'} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.controlButtonText}>Move Right</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.deleteButton]}
              onPress={() => handleDeleteImage(selectedImageIndex)}
            >
              <View style={styles.buttonContent}>
                <Trash2 size={18} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.controlButtonText}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
  galleryContainer: {
    position: 'relative',
    width: '100%',
  },
  overlayButton: {
    position: 'absolute',
    bottom: 45,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  selectButton: {
    bottom: 45,
    left: 10,
    right: 'auto',
  },
  overlayButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    minWidth: 110,
  },
  disabledControlButton: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    shadowOpacity: 0,
    elevation: 0,
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
    marginRight: 6,
  },
  buttonIcon: {
    marginRight: 6,
  },
});

export default ImageManager; 