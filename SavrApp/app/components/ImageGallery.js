import React, { useState, useRef } from 'react';
import { View, Image, Dimensions, FlatList, TouchableOpacity, Text } from 'react-native';
import { HOST_URL } from '@env';
import getStyles from '../styles/AppStyles';
const { width, height } = Dimensions.get('window');

/**
 * ImageGallery component for displaying swipeable images
 * 
 * @param {Object} props
 * @param {Array} props.images - Array of image objects with url, alt, and type properties
 * @param {string} props.baseUrl - Base URL to prepend to relative image paths (optional)
 * @param {number} props.height - Height of the gallery (default: 250)
 * @param {boolean} props.showIndicators - Whether to show pagination indicators (default: true)
 * @param {function} props.onImagePress - Callback when an image is pressed
 */
const ImageGallery = ({ 
  images, 
  baseUrl = '', 
  height = 250, 
  showIndicators = true,
  onImagePress
}) => {
  const styles = getStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // add host url to images
  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <View style={[styles.imageGallery.container, { height }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x250?text=No+Images' }}
          style={styles.imageGallery.placeholderImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Function to handle scroll end and update active index
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Get full image URL
  const getImageUrl = (url) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    const host_url_without_slash = HOST_URL.endsWith('/') ? HOST_URL.slice(0, -1) : HOST_URL;
    return `${host_url_without_slash}${url}`;
  };

  // Render each image
  const renderItem = ({ item, index }) => {
    const imageUrl = getImageUrl(item.url);
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={[styles.imageGallery.slide, { width, height }]}
        onPress={() => onImagePress && onImagePress(item, index)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.imageGallery.image}
          resizeMode="cover"
        />
        {item.alt && (
          <View style={styles.imageGallery.captionContainer}>
            <Text style={styles.imageGallery.caption}>{item.alt}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.imageGallery.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      />
      
      {showIndicators && images.length > 1 && (
        <View style={styles.imageGallery.pagination}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.imageGallery.paginationDot,
                index === activeIndex ? styles.imageGallery.paginationDotActive : {},
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageGallery; 