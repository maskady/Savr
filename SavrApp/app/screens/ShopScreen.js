import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import SettingsContext from '../contexts/SettingsContext';
import { getShopById, updateShop } from '../utils/api';
import { businessCategories } from '../constants/businessCategories';
import ShopContext from '../contexts/ShopContext';
import AuthContext from '../contexts/AuthContext';
import { getStyles } from '../styles/ShopScreenStyles';
import ShopHeader from '../components/ShopHeader';
import ShopContent from '../components/ShopContent';
import FullScreenImageModal from '../components/FullScreenImageModal';

const ShopScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const { updateShopInContext } = useContext(ShopContext);
  
  // Apply theme styles  
  const { darkMode } = useContext(SettingsContext);
  const styles = getStyles(darkMode);

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
  const primaryCategoryName = businessCategories[shop?.primaryCategory]?.name || shop?.primaryCategory;


  const goBackOrHome = () => {
    handleSaveChanges();

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTabs', { screen: 'Home' });
    }
  };
  

  const handleInputChange = (field, value) => {
    setShop(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Shop information not available
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={goBackOrHome}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ShopHeader
        editMode={editMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onToggleEdit={toggleEditMode}
        onShare={handleShare}
        onBack={goBackOrHome}
        darkMode={darkMode}
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
        colors={styles.colors}
        primaryCategoryName={primaryCategoryName}
        user={user}
        onCall={handleCall}
        onNavigate={handleNavigate}
        onInputChange={handleInputChange}
        onImagesChange={handleImagesChange}
        onImagePress={handleFullScreenImage}
        darkMode={darkMode}
      />
      <FullScreenImageModal
        image={fullScreenImage}
        onClose={() => setFullScreenImage(null)}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
};

export default ShopScreen;