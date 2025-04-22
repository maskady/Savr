import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Appearance, Alert } from 'react-native';
import getStyles from '../styles/AppStyles';
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

  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  

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
    <View style={styles.imageManager.container}>
      {/* Image Gallery with Overlay Button */}
      <View style={styles.imageManager.galleryContainer}>
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
              style={styles.imageManager.overlayButton} 
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.imageManager.buttonContent}>
                <Camera size={18} color={styles.imageManager.buttonIcon.color} style={styles.imageManager.buttonIcon} />
                <Text style={styles.imageManager.overlayButtonText}>Add Photo</Text>
              </View>
            </TouchableOpacity>

            {/* Overlay Selection Button */}
            {images.length > 0 && (
              <TouchableOpacity
                style={[styles.imageManager.overlayButton, styles.imageManager.selectButton]}
                onPress={() => setSelectedImageIndex(selectedImageIndex === null ? 0 : null)}
              >
                <View style={styles.imageManager.buttonContent}>
                  <Edit size={18} color={styles.imageManager.buttonIcon.color} style={styles.imageManager.buttonIcon} />
                  <Text style={styles.imageManager.overlayButtonText}>
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
        <View style={styles.imageManager.imageControls}>
          <View style={styles.imageManager.controlsRow}>
            <TouchableOpacity
              style={[styles.imageManager.controlButton, selectedImageIndex === 0 && styles.imageManager.disabledControlButton]}
              onPress={() => handleMoveImage(selectedImageIndex, 'down')}
              disabled={selectedImageIndex === 0}
            >
              <View style={styles.imageManager.buttonContent}>
                <ArrowLeft 
                  size={18} 
                  color={selectedImageIndex === 0 ? '#aaa' : styles.imageManager.buttonIcon.color} 
                  style={styles.imageManager.buttonIcon}
                />
                <Text style={styles.imageManager.controlButtonText}>Move Left</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.imageManager.controlButton, selectedImageIndex === images.length - 1 && styles.imageManager.disabledControlButton]}
              onPress={() => handleMoveImage(selectedImageIndex, 'up')}
              disabled={selectedImageIndex === images.length - 1}
            >
              <View style={styles.imageManager.buttonContent}>
                <ArrowRight 
                  size={18} 
                  color={selectedImageIndex === images.length - 1 ? '#aaa' : styles.imageManager.buttonIcon.color} 
                  style={styles.imageManager.buttonIcon}
                />
                <Text style={styles.imageManager.controlButtonText}>Move Right</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.imageManager.controlButton, styles.imageManager.deleteButton]}
              onPress={() => handleDeleteImage(selectedImageIndex)}
            >
              <View style={styles.imageManager.buttonContent}>
                <Trash2 size={18} color={styles.imageManager.buttonIcon.color} style={styles.imageManager.buttonIcon} />
                <Text style={styles.imageManager.controlButtonText}>Delete</Text>
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

export default ImageManager; 