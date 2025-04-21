import React, { useState } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HOST_URL } from '@env'; 
import QuantityCartButton from './QuantityCartButton';

const ProductDetailsModal = ({ item, visible, onClose, quantityButton }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!item) return null;

  console.log(`ProductDetailsModal item: ${JSON.stringify(item, null, 2)}`);

  const base_url = HOST_URL.endsWith('/') ? HOST_URL.slice(0, -1) : HOST_URL;
  const fullImageUrl = base_url + item?.productImages[activeImageIndex]?.url;
  
  
  
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{item.productName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
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
                      style={[styles.productImage, { width }]}
                      resizeMode="contain"
                    />
                  ))}
                </ScrollView>
                
                {item.productImages.length > 1 && (
                  <View style={styles.indicatorContainer}>
                    {item.productImages.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          activeImageIndex === index && styles.activeIndicator
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.productImage, { width, backgroundColor: '#f0f0f0' }]}>
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price} €</Text>
              {discount > 0 && (
                <View style={styles.discountContainer}>
                  <Text style={styles.originalPrice}>{item.originalPrice} €</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discount}%</Text>
                  </View>
                </View>
              )}
              {quantityButton}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {item.productDescription || 'No description available.'}
              </Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity available:</Text>
                <Text style={styles.detailValue}>{item.quantity}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Availability:</Text>
                <Text style={[styles.detailValue, { color: item.isAvailable ? 'green' : 'red' }]}>
                  {item.isAvailable ? 'In stock' : 'Out of stock'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Creation date:</Text>  
                <Text style={styles.detailValue}>{formatDate(item.dtcreated)}</Text>
              </View>
              {item.categories && item.categories.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Categories:</Text>
                  <Text style={styles.detailValue}>{item.categories.join(', ')}</Text>
                </View>
              )}
            </View>
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  productImage: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#007bff',
  },
  priceContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsModal;