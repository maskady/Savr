import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Appearance,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import getStyles from '../styles/CompanyShopStyles'; 
import getToken from '../utils/token';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import SettingsContext from '../contexts/SettingsContext';

const CompanyUpdateScreen = ({ route, navigation }) => {
  const [company, setCompany] = useState(route.params.company);
  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    setStyles(getStyles(darkMode));
  }, [darkMode]);
  
  const validateForm = () => {
    let tempErrors = {};
    
    if (!company.name) tempErrors.name = "Company name required";
    if (!company.email) tempErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(company.email)) tempErrors.email = "Email is invalid";
    if (!company.phone) tempErrors.phone = "Phone number required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdateCompany = async (company) => {
    console.log("Updating company:", company);
    try {
      const response = await fetch(`https://www.sevr.polaris.marek-mraz.com/api/company/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify(company)
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        Alert.alert("Success", "Company updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to update company.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      Alert.alert("Error", "An error occurred while updating the company.", [{ text: "OK" }]);
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Données de la compagnie pour mise à jour:", company);
      handleUpdateCompany(company);
    } else {
      Alert.alert(
        "Error",
        "Please fix the errors in the form.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleInputChange = (field, value) => {
    setCompany({
      ...company,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
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
        alt: "Company image",
        type: "titleImage"
      };
      
      setCompany({
        ...company,
        images: [...company.images, newImage]
      });
    }
  };
  
  const removeImage = (index) => {
    const updatedImages = [...company.images];
    updatedImages.splice(index, 1);
    setCompany({
      ...company,
      images: updatedImages
    });
  };

  const handleDeleteCompany = async () => {
    Alert.alert(
      "Delete Company",
      "Are you sure you want to delete this company?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const response = await fetch(`https://www.sevr.polaris.marek-mraz.com/api/company/${company.id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${await getToken()}`
                }
              });

              if (response.ok) {
                Alert.alert("Success", "Company deleted successfully!", [
                  { text: "OK", onPress: () => navigation.navigate('CompanyList') }
                ]);
              } else {
                Alert.alert("Error", "Failed to delete company.", [{ text: "OK" }]);
              }
            } catch (error) {
              console.error("Error deleting company:", error);
              Alert.alert("Error", "An error occurred while deleting the company.", [{ text: "OK" }]);
            }
          }
        }
      ]
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="arrow-left" size={24} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={styles.title}>Update Company</Text>
        <Ionicons name="trash" size={24} color="red" onPress={handleDeleteCompany} />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={company.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Name of the company"
          placeholderTextColor={styles.input.placeholderTextColor}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={company.description}
          onChangeText={(text) => handleInputChange('description', text)}
          placeholder="Description of the company"
          placeholderTextColor={styles.input.placeholderTextColor}
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={company.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder="Address"
          placeholderTextColor={styles.input.placeholderTextColor}
        />
      </View>
      
      <View style={styles.rowContainer}>
        <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={company.postalCode}
            onChangeText={(text) => handleInputChange('postalCode', text)}
            placeholder="ZIP Code"
            placeholderTextColor={styles.input.placeholderTextColor}
          />
        </View>
        
        <View style={[styles.inputGroup, {flex: 2}]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={company.city}
            onChangeText={(text) => handleInputChange('city', text)}
            placeholder="City"
            placeholderTextColor={styles.input.placeholderTextColor}
          />
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={company.country}
          onChangeText={(text) => handleInputChange('country', text)}
          placeholder="Country"
          placeholderTextColor={styles.input.placeholderTextColor}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone number *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={company.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder="+1234567890"
          placeholderTextColor={styles.input.placeholderTextColor}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={company.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="email@example.com"
          placeholderTextColor={styles.input.placeholderTextColor}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Images</Text>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={styles.imagePickerButtonText}>Add Image</Text>
        </TouchableOpacity>
        
        <View style={styles.imagesContainer}>
          {company.images && company.images.map((image, index) => (
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
          <Text style={styles.submitButtonText}>Update Company</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CompanyUpdateScreen;