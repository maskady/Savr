import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { HOST_URL } from '@env';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // add host url to images
  // If no images provided, show placeholder
  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x250?text=No+Images' }}
          style={styles.placeholderImage}
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
    return `${HOST_URL}${url}`;
  };

  // Render each image
  const renderItem = ({ item, index }) => {
    const imageUrl = getImageUrl(item.url);
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={[styles.slide, { width, height }]}
        onPress={() => onImagePress && onImagePress(item, index)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.alt && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{item.alt}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { height }]}>
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
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                index === activeIndex ? styles.paginationDotActive : {},
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ImageGallery; 