import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Appearance,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { request } from '../utils/request';
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { SettingsContext } from '../contexts/SettingsContext';
import getStyles from '../styles/OrdersStyles';

const Colors = {
  Primary: '#000000',      
  Grey: '#333333',        
  Success: '#444444',      
  Error: '#000000',        
  Warning: '#888888',      
  Info: '#555555',      
};


const OrdersScreen = () => {
  const route = useRoute();
  const { orders, setOrders, onRefresh, refreshing, setRefreshing } = route.params;
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles(darkMode));


  useEffect(() => {
    setStyles(getStyles(darkMode));

    // Trigger an initial refresh when the screen loads
    onRefresh();
  }, [darkMode]);

  const fetchOrders = () => {
    onRefresh();
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
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

  if (refreshing) {
    return (
      <>
        <StatusBar
          barStyle={styles.statusBar.barStyle} 
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
      </>
    );
  }

  if (error && !refreshing) {
    return (
      <>
        <StatusBar
          barStyle={styles.statusBar.barStyle} 
          backgroundColor={styles.statusBar.backgroundColor}
        />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryText}>Retry</Text>
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
          <FontAwesome6 name="arrow-left" size={24} color={styles.icon.color} onPress={() => navigation.goBack()} />
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
    </>
  );
};

export default OrdersScreen;