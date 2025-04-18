import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Appearance } from 'react-native';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import getStyles from '../styles/CompanyStyles'; 
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/token';
import { AuthContext } from '../contexts/AuthContext';

const CompanyListScreen = () => {
  const theme = Appearance.getColorScheme();
  console.log('Current theme:', theme);
  const [companyStyles, setCompanyStyles] = useState(getStyles());
  const navigation = useNavigation(); 
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      if (colorScheme) {
        setCompanyStyles(getStyles()); 
      }
    };

    const subscription = Appearance.addChangeListener(handleThemeChange);

    retrieveCompanies();

    return () => {
      subscription.remove();
    };

  }, []);

  
  // State to hold the companies data - will be replaced with API data later
  const [companies, setCompanies] = useState([
    {
      id: '1',
      name: 'Tech Solutions Inc.',
      address: '123 Innovation Street',
      city: 'San Francisco, CA 94107'
    },
    {
      id: '2',
      name: 'Global Marketing Group',
      address: '456 Business Avenue',
      city: 'New York, NY 10001'
    },
    {
      id: '3',
      name: 'Green Energy Solutions',
      address: '789 Eco Boulevard',
      city: 'Austin, TX 78701'
    },
    {
      id: '4',
      name: 'Creative Designs Co.',
      address: '321 Artist Lane',
      city: 'Los Angeles, CA 90012'
    },
    {
      id: '5',
      name: 'Financial Advisory Partners',
      address: '555 Investment Place',
      city: 'Chicago, IL 60602'
    },
    {
      id: '6',
      name: 'Health & Wellness Corp.',
      address: '888 Health Drive',
      city: 'Miami, FL 33101'
    },
    {
      id: '7',
      name: 'Travel & Leisure Group',
      address: '222 Adventure Road',
      city: 'Seattle, WA 98101'
    },
    {
      id: '8',
      name: 'E-commerce Solutions Ltd.',
      address: '111 Online Plaza',
      city: 'Boston, MA 02108'
    },
    {
      id: '9',
      name: 'Real Estate Holdings LLC',
      address: '777 Property Lane',
      city: 'Denver, CO 80202'
    },
    {
      id: '10',
      name: 'Food & Beverage Innovations',
      address: '999 Culinary Court',
      city: 'Portland, OR 97201'
    },
  ]);

  const retrieveCompanies = async () => {
    let onlyMyCompanies = true;
    if (user.roleId === 'admin') {
      onlyMyCompanies = false;
    }
    try{
      const response = await fetch('https://www.sevr.polaris.marek-mraz.com/api/company?onlyMyCompanies=' + onlyMyCompanies, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        }
      });
      

      const data = await response.json();

      console.log("Response data:", data);

      if (response.ok) {
        setCompanies(data.data);
      }
      else {
        console.error("Error fetching companies:", response);
      }
    }
    catch (error) {
      console.error("Error fetching companies :", error);
    }
  };

  const handleAddCompany = () => {
    navigation.navigate('CompanyCreation');
  };

  // Function to handle editing a company
  const handleEditCompany = (companyId) => {
    console.log('Edit company with ID:', companyId);
    // Retrieve the company details from the companies array
    const companyToEdit = companies.find(company => company.id === companyId);
    navigation.navigate('CompanyUpdate', { company: companyToEdit });
  };

  const handleOpenCompany = (company) => {
    console.log('Open company with ID:', company);
    navigation.navigate('ShopList', { company });
  };

  return (
    <SafeAreaView style={companyStyles.safeArea}>
      <StatusBar barStyle={companyStyles.isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header with title and add button */}
      <View style={[companyStyles.header, {
        borderBottomColor: companyStyles.isDarkMode ? '#444' : '#eee',
        backgroundColor: companyStyles.isDarkMode ? 'black' : 'white',
      }]}>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome6 name="arrow-left" size={24} color={companyStyles.isDarkMode ? 'white' : 'black'} style={{ marginRight: 10, marginTop: 5 }} />
          </TouchableOpacity>
          <Text style={[companyStyles.headerTitle, {
            color: companyStyles.isDarkMode ? 'white' : 'black',
          }]}>My Companies</Text>
        </View>

        <TouchableOpacity 
          style={companyStyles.addButton} 
          onPress={handleAddCompany}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Scrollable list of companies */}
      <ScrollView 
        style={[companyStyles.scrollContainer, {
          backgroundColor: companyStyles.isDarkMode ? 'black' : 'white',
        }]}
        contentContainerStyle={companyStyles.contentContainer}
      >
        {companies.length === 0 ? (
          <View style={companyStyles.emptyContainer}>
            <Text style={{ color: companyStyles.isDarkMode ? 'white' : 'black' }}>
              You don't have any companies yet. Tap the + button to add one.
            </Text>
          </View>
        ) : (
          companies.map((company) => (
            <TouchableOpacity 
              key={company.id} 
              onPress={() => handleOpenCompany(company)}
            >
              <View 
                style={[companyStyles.companyCard, {
                  backgroundColor: companyStyles.isDarkMode ? '#333' : 'white',
                  borderColor: companyStyles.isDarkMode ? '#444' : '#eee',
                }]}
              >
                <View style={companyStyles.companyInfo}>
                  <Text style={[companyStyles.companyName, {
                    color: companyStyles.isDarkMode ? 'white' : 'black',
                  }]}>{company.name}</Text>
                  <Text style={[companyStyles.companyAddress, {
                    color: companyStyles.isDarkMode ? '#bbb' : '#666',
                  }]}>{company.address}</Text>
                  <Text style={[companyStyles.companyCity, {
                    color: companyStyles.isDarkMode ? '#bbb' : '#666',
                  }]}>{company.city}</Text>
                </View>
                <TouchableOpacity 
                  style={companyStyles.editButton}
                  onPress={() => handleEditCompany(company.id)}
                >
                  <Feather name="edit" size={20} color={companyStyles.isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyListScreen;