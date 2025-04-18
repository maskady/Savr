import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Appearance,
  Alert,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import getStyles from '../styles/NewCompanyStyles'; 
import { getToken } from '../utils/token';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const ShopUpdateScreen = ({ route, navigation }) => {
  const [shop, setShop] = useState(route.params.shop);
  const [styles, setStyles] = useState(getStyles());
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      console.log("Theme changed:", colorScheme);
      if (colorScheme) {
        setStyles(getStyles());
      }
    };
    
    const subscription = Appearance.addChangeListener(handleThemeChange);

    fetchCategories();
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  const validateForm = () => {
    let tempErrors = {};
    
    if (!shop.name) tempErrors.name = "Shop name required";
    if (!shop.email) tempErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(shop.email)) tempErrors.email = "Email is invalid";
    if (!shop.phone) tempErrors.phone = "Phone number required";
    if (!shop.companyId) tempErrors.companyId = "Company ID required";
    
    if (shop.latitude && isNaN(parseFloat(shop.latitude))) 
      tempErrors.latitude = "Latitude must be a number";
    if (shop.longitude && isNaN(parseFloat(shop.longitude))) 
      tempErrors.longitude = "Longitude must be a number";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdateShop = async (shopData) => {
    console.log("Updating shop:", shopData);
    
    const dataToSend = {
      ...shopData,
      companyId: parseInt(shopData.companyId),
      latitude: shopData.latitude ? parseFloat(shopData.latitude) : null,
      longitude: shopData.longitude ? parseFloat(shopData.longitude) : null
    };
    
    try {
      const response = await fetch(`https://www.sevr.polaris.marek-mraz.com/api/shop/${shop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        Alert.alert("Success", "Shop updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to update shop.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      Alert.alert("Error", "An error occurred while updating the shop.", [{ text: "OK" }]);
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Shop data for update:", shop);
      handleUpdateShop(shop);
    } else {
      Alert.alert(
        "Error",
        "Please fix the errors in the form.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleInputChange = (field, value) => {
    setShop({
      ...shop,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  const addCategory = () => {
    if (categoryInput.trim()) {
      const updatedCategories = [...(shop.categories || []), categoryInput.trim()];
      setShop({
        ...shop,
        categories: updatedCategories,
        primaryCategory: shop.primaryCategory || categoryInput.trim()
      });
      setCategoryInput('');
    }
  };
  
  const removeCategory = (index) => {
    const updatedCategories = [...shop.categories];
    const removedCategory = updatedCategories[index];
    updatedCategories.splice(index, 1);
    
    const updatedPrimaryCategory = 
      shop.primaryCategory === removedCategory
        ? (updatedCategories.length > 0 ? updatedCategories[0] : '')
        : shop.primaryCategory;
    
    setShop({
      ...shop,
      categories: updatedCategories,
      primaryCategory: updatedPrimaryCategory
    });
  };
  
  const setPrimaryCategory = (category) => {
    setShop({
      ...shop,
      primaryCategory: category
    });
  };
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Media permission status:", status);
    
    if (status !== 'granted') {
      Alert.alert("Permission denied", "You need to grant permission to access the media library.");
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log("ImagePicker result:", result);
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImage = {
        url: result.assets[0].uri,
        alt: "Shop image",
        type: "titleImage"
      };
      
      setShop({
        ...shop,
        images: [...(shop.images || []), newImage]
      });
    }
  };
  
  const removeImage = (index) => {
    const updatedImages = [...(shop.images || [])];
    updatedImages.splice(index, 1);
    setShop({
      ...shop,
      images: updatedImages
    });
  };

  const handleDeleteShop = async () => {
    Alert.alert(
      "Delete Shop",
      "Are you sure you want to delete this shop?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const response = await fetch(`https://www.sevr.polaris.marek-mraz.com/api/shop/${shop.id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${await getToken()}`
                }
              });

              if (response.ok) {
                Alert.alert("Success", "Shop deleted successfully!", [
                  { text: "OK", onPress: () => navigation.navigate('ShopList', { company: { id: shop.companyId } }) }
                ]);
              } else {
                Alert.alert("Error", "Failed to delete shop.", [{ text: "OK" }]);
              }
            } catch (error) {
              console.error("Error deleting shop:", error);
              Alert.alert("Error", "An error occurred while deleting the shop.", [{ text: "OK" }]);
            }
          }
        }
      ]
    );
  }

  const fetchCategories = async () => {
      try {
        const response = await fetch('https://www.sevr.polaris.marek-mraz.com/api/category', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
  
        const body = await response.json();
        setCategories((body.data || []).map(category => category.name));
        console.log("Fetched categories:", categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }  
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Update Shop</Text>
        <Ionicons name="trash" size={24} color="red" onPress={handleDeleteShop} />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Shop Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={shop.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Name of the shop"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company ID *</Text>
        <TextInput
          style={[styles.input, errors.companyId && styles.inputError]}
          value={String(shop.companyId)}
          onChangeText={(text) => handleInputChange('companyId', text)}
          placeholder="Company ID"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          keyboardType="numeric"
        />
        {errors.companyId && <Text style={styles.errorText}>{errors.companyId}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={shop.description}
          onChangeText={(text) => handleInputChange('description', text)}
          placeholder="Description of the shop"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={shop.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder="Address"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
        />
      </View>
      
      <View style={styles.rowContainer}>
        <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={shop.postalCode}
            onChangeText={(text) => handleInputChange('postalCode', text)}
            placeholder="ZIP Code"
            placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          />
        </View>
        
        <View style={[styles.inputGroup, {flex: 2}]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={shop.city}
            onChangeText={(text) => handleInputChange('city', text)}
            placeholder="City"
            placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          />
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={shop.country}
          onChangeText={(text) => handleInputChange('country', text)}
          placeholder="Country"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
        />
      </View>
      
      <View style={styles.rowContainer}>
        <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={[styles.input, errors.latitude && styles.inputError]}
            value={shop.latitude ? String(shop.latitude) : ''}
            onChangeText={(text) => handleInputChange('latitude', text)}
            placeholder="Latitude"
            placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
            keyboardType="numeric"
          />
          {errors.latitude && <Text style={styles.errorText}>{errors.latitude}</Text>}
        </View>
        
        <View style={[styles.inputGroup, {flex: 1}]}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={[styles.input, errors.longitude && styles.inputError]}
            value={shop.longitude ? String(shop.longitude) : ''}
            onChangeText={(text) => handleInputChange('longitude', text)}
            placeholder="Longitude"
            placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
            keyboardType="numeric"
          />
          {errors.longitude && <Text style={styles.errorText}>{errors.longitude}</Text>}
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={shop.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder="+1234567890"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={shop.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="email@example.com"
          placeholderTextColor={Appearance.getColorScheme() === 'dark' ? '#888888' : '#AAAAAA'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      
      {/* Categories */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.rowContainer}>
          <View style={[styles.input, {flex: 3, marginRight: 10, justifyContent: 'center'}]}>
            <Picker
              selectedValue={categoryInput}
              onValueChange={(itemValue) => setCategoryInput(itemValue)}
              style={{height: 50, color: Appearance.getColorScheme() === 'dark' ? '#FFFFFF' : '#000000'}}
            >
              <Picker.Item label="Sélectionnez une catégorie" value="" />
              {categories.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity 
            style={[styles.imagePickerButton, {flex: 1, marginTop: 0}]} 
            onPress={addCategory}
            disabled={!categoryInput}
          >
            <Text style={styles.imagePickerButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={categoriesStyles.categoriesContainer}>
          {shop.categories && shop.categories.map((category, index) => (
            <View key={index} style={categoriesStyles.categoryItem}>
              <TouchableOpacity 
                style={[
                  categoriesStyles.categoryButton, 
                  category === shop.primaryCategory && categoriesStyles.primaryCategoryButton
                ]}
                onPress={() => setPrimaryCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    category === shop.primaryCategory && categoriesStyles.primaryCategoryText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={categoriesStyles.removeCategoryButton} 
                onPress={() => removeCategory(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {shop.categories && shop.categories.length > 0 && (
          <Text style={styles.helperText}>
            Tap on a category to set it as primary. Current primary: {shop.primaryCategory || 'None'}
          </Text>
        )}
      </View>
      
      {/* Images */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Images</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>Add Image</Text>
        </TouchableOpacity>
        
        <View style={styles.imagesContainer}>
          {shop.images && shop.images.map((image, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: image.url }} style={styles.thumbnail} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Shop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const categoriesStyles = {
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  primaryCategoryButton: {
    backgroundColor: '#007bff',
  },
  primaryCategoryText: {
    color: 'white',
  },
  removeCategoryButton: {
    marginLeft: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default ShopUpdateScreen;