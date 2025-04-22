import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import getStyles from '../styles/AppStyles';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { HOST_URL } from '@env'; 

const ProductDetailsModal = ({ item, visible, onClose, quantityButton }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!item) return null;

  console.log(`ProductDetailsModal item: ${JSON.stringify(item, null, 2)}`);

  const base_url = HOST_URL.endsWith('/') ? HOST_URL.slice(0, -1) : HOST_URL;
  const fullImageUrl = base_url + item?.productImages[activeImageIndex]?.url;
  const styles = getStyles();
  const { width } = Dimensions.get('window');
  const discount = item.originalPrice > item.price 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
    : 0;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.productDetailsModal.modalContainer}>
        <View style={styles.productDetailsModal.modalContent}>
          <View style={styles.productDetailsModal.header}>
            <Text style={styles.productDetailsModal.headerTitle}>{item.productName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.productDetailsModal.closeButton}>
              <Ionicons name="close" size={24} color={styles.productDetailsModal.iconStyle.color} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {item.productImages && item.productImages.length > 0 ? (
              <View>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
                    setActiveImageIndex(newIndex);
                  }}
                >
                  {item.productImages.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: fullImageUrl }}
                      style={[styles.productDetailsModal.productImage, { width }]}
                      resizeMode="contain"
                    />
                  ))}
                </ScrollView>
                
                {item.productImages.length > 1 && (
                  <View style={styles.productDetailsModal.indicatorContainer}>
                    {item.productImages.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.productDetailsModal.indicator,
                          activeImageIndex === index && styles.productDetailsModal.activeIndicator
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.productDetailsModal.productImage, { width }, styles.productDetailsModal.productImagePlaceholder]}>
                <Text style={styles.productDetailsModal.noImageText}>No image available</Text>
              </View>
            )}
            
            <View style={styles.productDetailsModal.priceContainer}>
              <>
                <Text style={styles.productDetailsModal.price}>{item.price} €</Text>
                {discount > 0 && (
                  <View style={styles.productDetailsModal.discountContainer}>
                    <Text style={styles.productDetailsModal.originalPrice}>{item.originalPrice} €</Text>
                    <View style={styles.productDetailsModal.discountBadge}>
                      <Text style={styles.productDetailsModal.discountText}>-{discount}%</Text>
                    </View>
                  </View>
                )}
              </>
              {quantityButton}
            </View>
            
            <View style={styles.productDetailsModal.section}>
              <Text style={styles.productDetailsModal.sectionTitle}>Description</Text>
              <Text style={styles.productDetailsModal.descriptionText}>
                {item.productDescription || 'No description available.'}
              </Text>
            </View>
            
            <View style={styles.productDetailsModal.section}>
              <Text style={styles.productDetailsModal.sectionTitle}>Details</Text>
              <View style={styles.productDetailsModal.detailRow}>
                <Text style={styles.productDetailsModal.detailLabel}>Quantity available:</Text>
                <Text style={styles.productDetailsModal.detailValue}>{item.quantity}</Text>
              </View>
              <View style={styles.productDetailsModal.detailRow}>
                <Text style={styles.productDetailsModal.detailLabel}>Availability:</Text>
                <Text style={[styles.productDetailsModal.detailValue, { color: item.isAvailable ? COLORS.success : COLORS.error }]}>
                  {item.isAvailable ? 'In stock' : 'Out of stock'}
                </Text>
              </View>
              <View style={styles.productDetailsModal.detailRow}>
                <Text style={styles.productDetailsModal.detailLabel}>Creation date:</Text>  
                <Text style={styles.productDetailsModal.detailValue}>{formatDate(item.dtcreated)}</Text>
              </View>
              {item.categories && item.categories.length > 0 && (
                <View style={styles.productDetailsModal.detailRow}>
                  <Text style={styles.productDetailsModal.detailLabel}>Categories:</Text>
                  <Text style={styles.productDetailsModal.detailValue}>{item.categories.join(', ')}</Text>
                </View>
              )}
            </View>
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProductDetailsModal;