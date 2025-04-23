import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { request } from '../utils/request';
import { FontAwesome6 } from '@expo/vector-icons';
import getStyles from '../styles/OrderDetailsStyles';
import SettingsContext from '../contexts/SettingsContext';

const Colors = {
  Primary: '#000000',      
  Grey: '#333333',        

  Success: '#444444',      
  lightGrey: '#CCCCCC',   
  darkGrey: '#666666',       

  Error: '#000000',        
  Warning: 'red',  
  Info: '#555555',      
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));

  const fetchOrderDetails = async () => {
    try {
      const { response, data } = await request(`/order/${orderId}`, 'GET');
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      setOrder(data.data);
      if (data.data.shopId) {
        setShopName(await fetchShopName(data.data.shopId));
      } else {
        setShopName('Unknown Shop');
      }
      console.log('Order details:', data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load order details. Please try again.');
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopName = async (shopId) => {
    try {
      const { response, data } = await request(`/shop/${shopId}`, 'GET');

      return data.data.name;
    } catch (error) {
      console.error('Error fetching shop name:', error);
      return 'Unknown Shop';
    }
  };

  useEffect(() => {    
    fetchOrderDetails();
    setStyles(getStyles(darkMode));  
  }, [orderId, darkMode]);

  const getStatusText = (status) => {
    // Convert status codes to readable text
    switch(status) {
      case 'pen': return 'Pending';
      case 'con': return 'Confirmed';
      case 'pre': return 'Preparing';
      case 'del': return 'Delivered';
      case 'com': return 'Completed';
      case 'can': return 'Cancelled';
      case 'nos': return 'Not Show';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    // "pen" -- Pending "pai" -- Paid "con" -- Confirmed "pre" -- Preparing "del" -- Delivered "com" -- Completed "can" -- Cancelled "nos" -- Not Show
    switch (status.toLowerCase()) {
      case 'pen':
        return Colors.Warning;
      case 'pai':
        return Colors.Success;
      case 'con':
        return Colors.Success;
      case 'pre':
        return Colors.Primary;
      case 'del':
        return Colors.Info;
      case 'com':
        return Colors.Success;
      case 'can':
        return Colors.Error;
      case 'nos':
        return Colors.Error;
      default:
        return Colors.Primary;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <>
        <StatusBar 
          barStyle={styles.statusBar.barStyle} 
          backgroundColor={styles.statusBar.backgroundColor} 
        />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle={styles.statusBar.barStyle} 
        backgroundColor={styles.statusBar.backgroundColor} 
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={24} color={styles.icon.color} />
          </TouchableOpacity>
          <Text style={styles.title}>Order #{order.id}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.orderInfoContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shop:</Text>
              <Text style={styles.infoValue}>{shopName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total:</Text>
              <Text style={styles.infoValue}>{order.price} {order.currencyId}</Text>
            </View>
            
            {order.dtcreated && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>{formatDate(order.dtcreated)}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.productVariants && order.productVariants.length > 0 ? (
            order.productVariants.map((item) => (
              <View key={item.id} style={styles.productCard}>
                {item.images && item.images.length > 0 && (
                  <Image 
                    source={{ uri: `https://www.sevr.polaris.marek-mraz.com${item.images[0].url}` }} 
                    style={styles.productImage} 
                    defaultSource={require('../../assets/images/splash-icon.png')}
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                  <Text style={styles.productPrice}>{item.price} {item.currencyId}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No items in this order</Text>
          )}

          <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>{order.price} {order.currencyId}</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default OrderDetailsScreen;