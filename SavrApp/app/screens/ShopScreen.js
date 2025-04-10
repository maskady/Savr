import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Share,
  ActivityIndicator,
  Dimensions,
  Modal,
  Button,
  Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Phone, MapPin, Clock, Calendar, Share as ShareIcon, Star, Save } from 'lucide-react-native';
import { SettingsContext } from '../contexts/SettingsContext';
import MapView, { Marker } from 'react-native-maps';
import { getShopById, updateShop } from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import ImageUploadModal from '../components/ImageUploadModal';
const { width } = Dimensions.get('window');

const ShopScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);
  const [shop, setShop] = useState(route.params?.shop || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // images
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleUploadSuccess = ({ fileUrl }) => {
    setUploadedImageUrl(fileUrl);
    console.log("uploadedImageUrl", uploadedImageUrl);  

    // update shop
    const updatedShop = { ...shop, images: [...shop.images, { url: fileUrl, alt: 'Uploaded Image', type: 'uploaded' }] };
    setShop(updatedShop);
    setHasChanges(true);
  };

  
  // Define colors based on dark mode
  const colors = {
    background: darkMode ? '#121212' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    subtext: darkMode ? '#aaaaaa' : '#666666',
    primary: darkMode ? '#6200ea' : '#2e7d32',
    card: darkMode ? '#1e1e1e' : '#f5f5f5',
    border: darkMode ? '#333333' : '#e0e0e0',
  };

  useEffect(() => {

    setHasChanges(true);

    const fetchShopDetails = async () => {
      if (!shop?.id) return;
      
      setLoading(true);
      try {
        const details = await getShopById(shop.id);
        console.log("details", JSON.stringify(details, null, 2));
        const data = details.data;

        if (data) {
          // Create a new images array, don't try to modify details.images directly
          let shopImages = data.images || [];
          let categories = data.categories || [];

          if (shopImages.length === 0) {
            shopImages = [{
              url: 'https://via.placeholder.com/400x250?text=No+Images',
              alt: 'No images available',
              type: 'placeholder'
            }];
          }

          setShop({...data, images: shopImages, categories});
        }
      } catch (err) {
        console.error('Error fetching shop details:', err);
        setError('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shop?.id]);

  const handleCall = () => {
    if (shop?.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  };

  const handleNavigate = () => {
    if (shop?.latitude && shop?.longitude) {
      const url = `https://maps.apple.com/?daddr=${shop.latitude},${shop.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${shop?.name} on Savr App! They have great deals and help reduce food waste.`,
        url: 'https://savr.app',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleImagePress = (image) => {
    setFullScreenImage(image);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      // remove placeholder images
      const updatedShop = { ...shop, images: shop.images.filter(image => image.type !== 'placeholder') };
      setShop(updatedShop);

      await updateShop(shop.id, updatedShop);
      
      Alert.alert( "Success", "Your changes have been saved successfully.", [{ text: "OK" }]);
      setHasChanges(false);

    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert(
        "Error",
        "Failed to save your changes. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!shop) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Shop information not available
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          {hasChanges && (
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { backgroundColor: isSaving ? 'rgba(0,0,0,0.4)' : 'rgba(46,125,50,0.9)' }
              ]}
              onPress={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View style={styles.saveButtonContent}>
                  <Save size={16} color="#fff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleShare}
            style={[styles.shareButton, { marginLeft: hasChanges ? 8 : 0 }]}
          >
            <ShareIcon size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading shop details...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <ImageGallery 
            images={shop.images}
            height={250}
            onImagePress={handleImagePress}
          />

          <Button title="Upload Image" onPress={() => setModalVisible(true)} />

          <ImageUploadModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onUploadSuccess={handleUploadSuccess}
          />


          {/* Shop Info */}
          <View style={[styles.infoContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.shopName, { color: colors.text }]}>{shop.name}</Text>
            
            {shop.rating && (
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(shop.rating) ? colors.primary : 'none'}
                    color={star <= Math.round(shop.rating) ? colors.primary : colors.subtext}
                  />
                ))}
                <Text style={[styles.ratingText, { color: colors.subtext }]}>
                  {shop.rating.toFixed(1)} ({shop.ratings_count || 0} ratings)
                </Text>
              </View>
            )}

            {shop.category && (
              <Text style={[styles.categoryText, { color: colors.subtext }]}>
                {shop.category}
              </Text>
            )}

            {/* Description */}
            <View style={[styles.sectionContainer, { borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
              <Text style={[styles.descriptionText, { color: colors.subtext }]}>
                {shop.description || 'No description available for this shop.'}
              </Text>
            </View>

            {/* Contact & Location */}
            <View style={[styles.sectionContainer, { borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact & Location</Text>
              
              {shop.phone && (
                <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                  <Phone size={20} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>{shop.phone}</Text>
                </TouchableOpacity>
              )}
              
              {(shop.address || shop.postalCode || shop.city || shop.country) && (
                <TouchableOpacity style={styles.contactItem} onPress={handleNavigate}>
                  <MapPin size={20} color={colors.primary} />
                  <View >
                    {shop.address && (
                      <Text style={[styles.contactText, { color: colors.text }]}>{shop.address}</Text>
                    )}
                    {(shop.postalCode || shop.city) && (
                      <Text style={[styles.contactText, { color: colors.text }]}>
                        {[
                          shop.postalCode || '',
                          shop.city || ''
                        ].filter(Boolean).join(' ')}
                      </Text>
                    )}
                    {shop.country && (
                      <Text style={[styles.contactText, { color: colors.text }]}>{shop.country}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}

            </View>

            {/* Map */}
            {shop.latitude && shop.longitude && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: shop.latitude,
                    longitude: shop.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: shop.latitude,
                      longitude: shop.longitude,
                    }}
                    title={shop.name}
                  />
                </MapView>
                <TouchableOpacity
                  style={[styles.directionsButton, { backgroundColor: colors.primary }]}
                  onPress={handleNavigate}
                >
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Available Products */}
            {shop.products && shop.products.length > 0 && (
              <View style={[styles.sectionContainer, { borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Products</Text>
                {shop.products.map((product, index) => (
                  <View 
                    key={index} 
                    style={[styles.productCard, { backgroundColor: colors.card }]}
                  >
                    {product.image && (
                      <Image 
                        source={{ uri: product.image }} 
                        style={styles.productImage} 
                      />
                    )}
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: colors.text }]}>
                        {product.name}
                      </Text>
                      {product.description && (
                        <Text style={[styles.productDescription, { color: colors.subtext }]}>
                          {product.description}
                        </Text>
                      )}
                      <View style={styles.productPriceContainer}>
                        {product.original_price && (
                          <Text style={[styles.productOriginalPrice, { color: colors.subtext }]}>
                            €{product.original_price.toFixed(2)}
                          </Text>
                        )}
                        <Text style={[styles.productPrice, { color: colors.primary }]}>
                          €{product.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Full Screen Image Modal */}
      <Modal
        visible={!!fullScreenImage}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}
      >
        <View style={styles.fullScreenModal}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setFullScreenImage(null)}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          {fullScreenImage && (
            <Image
              source={{ uri: fullScreenImage.url }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(46,125,50,0.9)',
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
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  infoContainer: {
    padding: 16,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionContainer: {
    marginTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 12,
  },
  mapContainer: {
    marginTop: 24,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productOriginalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  addressContainer: {
    marginLeft: 12,
    flex: 1,
  },
});

export default ShopScreen; 