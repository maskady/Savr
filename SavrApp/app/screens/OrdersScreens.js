import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Appearance
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import {request} from '../utils/request';

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

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [styles, setStyles] = useState(getStyles());
  const { user } = useContext(AuthContext); 

  const fetchOrders = async () => {
    try {
      const parameters = user.roleId === 'admin' ? null : 'orderUserId=' + user.id;
      const { response, data } = await request('/order', 'GET', null, parameters);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      if (data && data.data.length > 0) {
        setOrders(data.data);
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());
    });
    fetchOrders();

    return () => subscription.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const getStatusColor = (status) => {
    // "pen" -- Pending "con" -- Confirmed "pre" -- Preparing "del" -- Delivered "com" -- Completed "can" -- Cancelled "nos" -- Not Show
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
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format: Jan 1, 2023, 12:00 PM
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

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        {/*<Text style={styles.orderInfo}>Shop ID: {item.shopId}</Text>*/}
        <Text style={styles.orderInfo}>Price: {item.price} {item.currencyId}</Text>
        <Text style={styles.orderInfo}>Created: {formatDate(item.dtcreated)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.Primary]}
              tintColor={Colors.Primary}
            />
          }
        />
      )}
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
    header: {
      marginTop: 50, // Adjust for notch
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    orderCard: {
      backgroundColor: isDarkMode ? Colors.Grey : Colors.White,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: Colors.Black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    orderId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? Colors.White : Colors.Black,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: Colors.White,
      fontSize: 12,
      fontWeight: '600',
    },
    orderDetails: {
      gap: 4,
    },
    orderInfo: {
      fontSize: 14,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? Colors.lightGrey : Colors.darkGrey,
    },
    errorText: {
      fontSize: 16,
      color: Colors.Error,
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

export default OrdersScreen;