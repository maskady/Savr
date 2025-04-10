import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Appearance } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const CompanyListScreen = () => {
  const theme = Appearance.getColorScheme();
  console.log('Current theme:', theme);
  const [companyStyles, setCompanyStyles] = useState(getStyles());

  useEffect(() => {
    const handleThemeChange = ({ colorScheme }) => {
      console.log("Theme changed:", colorScheme);
      if (colorScheme) {
        setCompanyStyles(getStyles()); 
      }
    };

    const subscription = Appearance.addChangeListener(handleThemeChange);

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
  ]);

  // Function to handle adding a new company
  const handleAddCompany = () => {
    // TODO: Navigate to add company screen or open modal
    console.log('Navigate to add company screen or open modal');
  };

  // Function to handle editing a company
  const handleEditCompany = (companyId) => {
    // TODO: Navigate to edit company screen or open modal with the selected company details
    console.log('Edit company with ID:', companyId);
  };

  return (
    <SafeAreaView style={companyStyles.safeArea}>
      <StatusBar barStyle={companyStyles.isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header with title and add button */}
      <View style={[companyStyles.header, {
        borderBottomColor: companyStyles.isDarkMode ? '#444' : '#eee',
        backgroundColor: companyStyles.isDarkMode ? 'black' : 'white',
      }]}>
        <Text style={[companyStyles.headerTitle, {
          color: companyStyles.isDarkMode ? 'white' : 'black',
        }]}>My Companies</Text>
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
            <View 
              key={company.id} 
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
                <Feather name="edit" size={20} color={companyStyles.isDarkMode ? 'white' : '#555'} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyListScreen;