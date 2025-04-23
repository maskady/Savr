import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import getStyles from '../styles/CompanyStyles'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/token';
import AuthContext from '../contexts/AuthContext';
import SettingsContext from '../contexts/SettingsContext';

const CompanyListScreen = () => {
  const { darkMode } = useContext(SettingsContext);
  const [companyStyles, setCompanyStyles] = useState(getStyles(darkMode));
  const navigation = useNavigation(); 
  const { user } = useContext(AuthContext); 
  const route = useRoute();
  const from = route.params?.from || null; 
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false); 

  useEffect(() => {
    retrieveCompanies();

    setCompanyStyles(getStyles(darkMode));
  }, [darkMode]);

  
  // State to hold the companies data - will be replaced with API data later
  const [companies, setCompanies] = useState(null);

  const retrieveCompanies = async () => {
    setIsLoadingCompanies(true);
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
        setIsLoadingCompanies(false);
        if (from === 'home' && data.data.length < 2) {
          navigation.navigate('ShopList', { company: data.data[0] });
        }
      }
      else {
        console.error("Error fetching companies:", response);
        setIsLoadingCompanies(false);
      }
    }
    catch (error) {
      console.error("Error fetching companies :", error);
      setIsLoadingCompanies(false);
    }
  };

  const handleAddCompany = () => {
    navigation.navigate('CompanyCreation', { handleRefresh: refreshCompanies });
  };

  // Function to handle editing a company
  const handleEditCompany = (companyId) => {
    console.log('Edit company with ID:', companyId);
    // Retrieve the company details from the companies array
    const companyToEdit = companies.find(company => company.id === companyId);
    navigation.navigate('CompanyUpdate', { company: companyToEdit, handleRefresh: refreshCompanies });
  };

  const handleOpenCompany = (company) => {
    console.log('Open company with ID:', company);
    navigation.navigate('ShopList', { company });
  };

  const refreshCompanies = () => {
    retrieveCompanies();
  };

  const renderCompany = ({ item: company }) => (
    <TouchableOpacity onPress={() => handleOpenCompany(company)}>
      <View style={companyStyles.companyCard}>
        <View style={companyStyles.companyInfo}>
          <Text style={companyStyles.companyName}>{company.name}</Text>
          <Text style={companyStyles.companyAddress}>{company.address}</Text>
          <Text style={companyStyles.companyCity}>{company.city}</Text>
        </View>
        <TouchableOpacity
          style={companyStyles.editButton}
          onPress={() => handleEditCompany(company.id)}
        >
          <Feather name="edit" size={20} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={companyStyles.safeArea}>
      <StatusBar
        barStyle={companyStyles.statusBar.barStyle}
        backgroundColor={companyStyles.statusBar.backgroundColor}
      />
      
      {/* Header with title and add button */}
      <View style={companyStyles.header}>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome6 name="arrow-left" size={24} color={darkMode ? 'white' : 'black'} style={{ marginRight: 10, marginTop: 5 }} />
          </TouchableOpacity>
          <Text style={companyStyles.headerTitle}>My Companies</Text>
        </View>

        <TouchableOpacity 
          style={companyStyles.addButton} 
          onPress={handleAddCompany}
        >
          <AntDesign name="plus" size={24} color={darkMode ? 'black' : 'white'} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={companies}
        renderItem={renderCompany}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          companies?.length === 0
            ? companyStyles.emptyContainer
            : companyStyles.contentContainer
        }
        ListEmptyComponent={
          <Text style={{ color: darkMode ? 'white' : 'black' }}>
            You don't have any companies yet. Tap the + button to add one.
          </Text>
        }
        refreshing={isLoadingCompanies}
        onRefresh={refreshCompanies}
      />
    </SafeAreaView>
  );
};

export default CompanyListScreen;