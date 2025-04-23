import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { AuthContext } from '../contexts/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { SettingsContext } from '../contexts/SettingsContext';
import getStyles from '../styles/OrdersStyles';
import OrderItem from '../components/OrderItem'; 

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
  const { orders = [], onRefresh, refreshing } = route.params || {};
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);
  const styles = useMemo(() => getStyles(darkMode), [darkMode]);
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'past', title: 'Past Orders' },
    { key: 'upcoming', title: 'Upcoming Orders' },
  ]);

  const pastOrders = useMemo(() => {
    return orders.filter(order => {
      return ['com', 'can', 'nos', 'del'].includes(order.status?.toLowerCase());
    });
  }, [orders]);

  const upcomingOrders = useMemo(() => {
    return orders.filter(order => {
      return ['pen', 'pai', 'con', 'pre'].includes(order.status?.toLowerCase());
    });
  }, [orders]);

  useEffect(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  const handleOrderPress = useCallback((order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  }, [navigation]);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'pen': return Colors.Warning;
      case 'pai': return Colors.Success;
      case 'con': return Colors.Success;
      case 'pre': return Colors.Primary;
      case 'del': return Colors.Info;
      case 'com': return Colors.Success;
      case 'can': return Colors.Error;
      case 'nos': return Colors.Error;
      default: return Colors.Primary;
    }
  }, []);

  const dateCache = new Map();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';

    if (dateCache.has(dateString)) {
      return dateCache.get(dateString);
    }  

    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format: Jan 1, 2023, 12:00 PM
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      dateCache.set(dateString, formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  }, []);

  const renderOrderItem = useCallback(({ item }) => (
    <OrderItem 
      order={item} 
      onPress={handleOrderPress} 
      styles={styles} 
      formatDate={formatDate} 
      getStatusColor={getStatusColor} 
    />
  ), [handleOrderPress, styles, formatDate, getStatusColor]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderScene = useCallback(({ route }) => {
    const currentOrders = route.key === 'past' ? pastOrders : upcomingOrders;
    
    if (refreshing) {
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
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
          <FlatList
            data={currentOrders}
            renderItem={renderOrderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.Primary]}
                tintColor={Colors.Primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {route.key === 'past' ? 'No past orders found.' : 'No upcoming orders found.'}
                </Text>
              </View>
            }
          />
      </View>
    );
  }, [pastOrders, upcomingOrders, refreshing, error, styles, renderOrderItem, keyExtractor, onRefresh]);

  const renderTabBar = useCallback(props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors.Primary }}
      style={{ backgroundColor: styles.tabBar.backgroundColor, color: "black" }}
      activeColor={styles.tabBar.activeTextColor}          
      inactiveColor={styles.tabBar.inactiveTextColor}
    />
  ), [styles.tabBar]);

  return (
    <>
      <StatusBar
        barStyle={styles.statusBar.barStyle} 
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome6 name="arrow-left" size={24} color={styles.icon.color} />
          </TouchableOpacity>
          <Text style={styles.title}>Mes Commandes</Text>
        </View>
        
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          swipeEnabled={true}
        />
      </View>
    </>
  );
};

export default OrdersScreen;