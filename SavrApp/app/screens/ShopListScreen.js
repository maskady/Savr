import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Appearance } from 'react-native';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import getStyles from '../styles/CompanyStyles'; // Réutilisation du même fichier de style
import { useNavigation, useRoute } from '@react-navigation/native';
import { getToken } from '../utils/token';
import { AuthContext } from '../contexts/AuthContext';

const ShopListScreen = () => {
  const theme = Appearance.getColorScheme();
  console.log('Current theme:', theme);
  const [styles, setStyles] = useState(getStyles());
  const navigation = useNavigation();
  const route = useRoute();
  const { company } = route.params || { company: { id: null, name: 'All Shops' } };
  const { user } = useContext(AuthContext);

  // State pour stocker les shops
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      if (colorScheme) {
        setStyles(getStyles());
      }
    };

    const subscription = Appearance.addChangeListener(handleThemeChange);

    retrieveShops();

    return () => {
      subscription.remove();
    };
  }, [company.id]);

  const retrieveShops = async () => {
    setIsLoading(true);
    try {
      let url = 'https://www.sevr.polaris.marek-mraz.com/api/shop?latitude=0&longitude=0&radius=10000';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        }
      });

      console.log("Shop response status:", response.status);
      const body = await response.json();

      console.log("Shop response data:", body);

      if (response.ok) {
        // Filter shops by company ID if provided
        console.log("Company ID:", company.id);
        const filteredShops = company.id ? body.data.filter(shop => shop.companyId === company.id) : body.data;
        console.log("Filtered shops:", filteredShops);
        setShops(filteredShops);
      } else {
        console.error("Error fetching shops:", response);
      }
    } catch (error) {
      console.error("Error fetching shops catch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddShop = () => {
    navigation.navigate('ShopCreation', { companyId: company.id });
  };

  const handleEditShop = (shop) => {
    console.log('Edit shop:', shop.name);
    navigation.navigate('ShopUpdate', { shop });
  };

  const handleDetailShop = (shop) => {
    console.log('Detail shop:', shop.name);
    navigation.navigate('Shop', { shop });
  };

  // Fonction pour obtenir l'image principale d'un shop
  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    const titleImage = images.find(img => img.type === 'titleImage');
    return titleImage || images[0];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={styles.isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header avec le nom de la compagnie et bouton d'ajout */}
      <View style={[styles.header, {
        borderBottomColor: styles.isDarkMode ? '#444' : '#eee',
        backgroundColor: styles.isDarkMode ? 'black' : 'white',
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6 name="arrow-left" size={24} color={styles.isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {
          color: styles.isDarkMode ? 'white' : 'black',
        }]}>{company.name ? `${company.name} - Shops` : 'All Shops'}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddShop}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Liste déroulante des shops */}
      <ScrollView 
        style={[styles.scrollContainer, {
          backgroundColor: styles.isDarkMode ? 'black' : 'white',
        }]}
        contentContainerStyle={styles.contentContainer}
      >
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: styles.isDarkMode ? 'white' : 'black' }}>
              Loading shops...
            </Text>
          </View>
        ) : shops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: styles.isDarkMode ? 'white' : 'black' }}>
              No shops found. Tap the + button to add one.
            </Text>
          </View>
        ) : (
          shops.map((shop) => (
            <TouchableOpacity onPress={() => handleDetailShop(shop)} key={shop.id}>
              <View 
                style={[styles.companyCard, {
                  backgroundColor: styles.isDarkMode ? '#333' : 'white',
                  borderColor: styles.isDarkMode ? '#444' : '#eee',
                }]}
              >
                <View style={styles.companyInfo}>
                  <Text style={[styles.companyName, {
                    color: styles.isDarkMode ? 'white' : 'black',
                  }]}>{shop.name}</Text>
                  <Text style={[styles.companyAddress, {
                    color: styles.isDarkMode ? '#bbb' : '#666',
                  }]}>{shop.address}</Text>
                  <Text style={[styles.companyCity, {
                    color: styles.isDarkMode ? '#bbb' : '#666',
                  }]}>{shop.city}, {shop.postalCode}</Text>
                  {shop.primaryCategory && (
                    <Text style={[styles.companyCity, {
                      color: styles.isDarkMode ? '#8af' : '#36f',
                      marginTop: 4,
                    }]}>Category: {shop.primaryCategory}</Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditShop(shop)}
                >
                  <Feather name="edit" size={20} color={styles.isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopListScreen;