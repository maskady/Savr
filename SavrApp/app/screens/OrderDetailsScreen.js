import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Appearance
} from 'react-native';
import { request } from '../utils/request';
import { FontAwesome6 } from '@expo/vector-icons';

const Colors = {
  Primary: '#000000',      
  Secondary: '#333333',    
  White: '#FFFFFF',       
  Black: '#000000',       
  Grey: '#333333',        
  lightGrey: '#CCCCCC',   
  darkGrey: '#666666',    
  Success: '#444444',      
  Error: '#000000',        
  Warning: '#888888',      
  Info: '#555555',      
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [styles, setStyles] = useState(getStyles());

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
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());
    });
    
    fetchOrderDetails();
    
    return () => subscription.remove();
  }, [orderId]);

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
    switch (status.toLowerCase()) {
      case 'pen':
        return Colors.Warning;
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
      <View style={styles.centered}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
  );
};

const getStyles = () => {
  const theme = Appearance.getColorScheme();
  const isDarkMode = theme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? Colors.Black : Colors.White,
    },
    icon: {
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    header: {
      marginTop: 50, // Adjust for notch
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    headerSpacer: {
      width: 24, // to balance the header
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
      flex: 1,
      textAlign: 'center',
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    orderInfoContainer: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      shadowColor: Colors.Black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
      marginBottom: 12,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      color: Colors.White,
      fontSize: 14,
      fontWeight: '600',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: isDarkMode ? Colors.White : Colors.Black,
      textAlign: 'right',
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
      marginVertical: 16,
    },
    productCard: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      shadowColor: Colors.Black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 4,
      backgroundColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
    },
    productInfo: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    productName: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkMode ? Colors.White : Colors.Black,
      marginBottom: 4,
    },
    productQuantity: {
      fontSize: 14,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? Colors.White : Colors.Black,
      marginTop: 4,
    },
    noItemsText: {
      fontSize: 16,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
      textAlign: 'center',
      marginVertical: 20,
    },
    totalSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderColor: isDarkMode ? Colors.darkGrey : Colors.lightGrey,
      marginTop: 8,
      marginBottom: 30,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    errorText: {
      fontSize: 16,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
      marginBottom: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: Colors.Primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    retryText: {
      color: Colors.White,
      fontWeight: '600',
    },
  });
};

export default OrderDetailsScreen;