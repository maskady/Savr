import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SettingsContext } from '../contexts/SettingsContext';
import { getShopById, updateShop } from '../utils/api';
import { businessCategories } from '../constants/businessCategories';
import { ShopContext } from '../contexts/ShopContext';
import { AuthContext } from '../contexts/AuthContext';
import ShopHeader from '../components/ShopHeader';
import ShopContent from '../components/ShopContent';
import FullScreenImageModal from '../components/FullScreenImageModal';

const ShopScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { user } = useContext(AuthContext);

  const goBackOrHome = async () => {
    await handleSaveChanges();

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTabs', { screen: 'Home' });
    }
  };
  const { darkMode } = useContext(SettingsContext);
  const { updateShopInContext } = useContext(ShopContext);
  const [shop, setShop] = useState(route.params?.shop || null);
  const [oldShop, setOldShop] = useState(route.params?.shop || null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [editMode, setEditMode] = useState('view'); // view, edit, saving

  // get primary category name from businessCategories object 
  const primaryCategoryName = businessCategories[shop.primaryCategory]?.name || shop.primaryCategory;

  const handleInputChange = (field, value) => {
    setShop(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // I am here
  const colors = {
    background: darkMode ? '#121212' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    subtext: darkMode ? '#aaaaaa' : '#666666',
    primary: darkMode ? '#6200ea' : '#2e7d32',
    card: darkMode ? '#1e1e1e' : '#f5f5f5',
    border: darkMode ? '#333333' : '#e0e0e0',
  };

  // I want to jump here

  useEffect(() => {

    const fetchShopDetails = async () => {
      if (!shop?.id) return;

      setLoading(true);
      try {
        const details = await getShopById(shop.id);
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

          setShop({ ...data, images: shopImages, categories });
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
      const url = `https://maps.apple.com/?daddr=${shop.latitude},${shop.longitude}`; // TODO: Use default map and export to string constants
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

  const handleFullScreenImage = (image) => {
    setFullScreenImage(image);
  };

  const handleSaveChanges = () => {
    if (!hasChanges) return;
  
    Alert.alert(
      "Save",                                         // title
      "Are you sure you want to save your edits?",    // message (string!)
      [                                               // ← third param: buttons
        { text: "No",  style: "cancel", onPress: discardChanges },
        { text: "Yes", onPress: saveChanges },
      ]
    );

    setEditMode('view');
    setIsSaving(false);
    setHasChanges(false);
  };

  const saveChanges = async () => {
    if (!hasChanges || isSaving) return;

    setEditMode('saving');
    setIsSaving(true);
    try {
      // remove placeholder images
      const updatedShop = { ...shop, images: shop.images.filter(image => image.type !== 'placeholder') };
      
      // Update the shop in local state
      setShop(updatedShop);
      
      // Update the shop in the backend
      await updateShop(shop.id, updatedShop);
      
      // Update the shop in context
      updateShopInContext(updatedShop);
      setOldShop(shop);
      
      Alert.alert("Success", "Your changes have been saved successfully.", [{ text: "OK" }]);
      setHasChanges(false);
      setEditMode('view');
      
    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert(
        "Error",
        "Failed to save your changes. Please try again.",
        [{ text: "OK" }]
      );
      setEditMode('edit');
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    setShop(oldShop);
    setHasChanges(false);
    setEditMode('view');
    setIsSaving(false);
    Alert.alert("Changes Discarded", "Your changes have been discarded.", [{ text: "OK" }]);
  };

  const toggleEditMode = () => {
    if (editMode === 'edit') {
      discardChanges(); 
    }
    setEditMode(editMode === 'view' ? 'edit' : 'view');
  };

  const handleImagesChange = (updatedImages) => {
    setShop(prev => ({
      ...prev,
      images: updatedImages
    }));
    setHasChanges(true);
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
            onPress={goBackOrHome}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <ShopHeader
        editMode={editMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onToggleEdit={toggleEditMode}
        onShare={handleShare}
        onBack={goBackOrHome}
      />
      <ShopContent
        shop={shop}
        variants={variants}
        setVariants={setVariants}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        editMode={editMode}
        colors={colors}
        primaryCategoryName={primaryCategoryName}
        user={user}
        onCall={handleCall}
        onNavigate={handleNavigate}
        onInputChange={handleInputChange}
        onImagesChange={handleImagesChange}
        onImagePress={handleFullScreenImage}
      />
      <FullScreenImageModal
        image={fullScreenImage}
        onClose={() => setFullScreenImage(null)}
      />
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
  },
  dropdownContainer: {
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc', // You can adjust this or use colors.border if accessible
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden'
  },
  dropdownPicker: {
    height: 40,
    width: '100%',
  },
  dropdownTrigger: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 8,
  },
  dropdownTriggerText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 4,
    width: 250,
    maxHeight: 300,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ShopScreen; 