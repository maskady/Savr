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
import { useRoute, useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SettingsContext from '../contexts/SettingsContext';
import getStyles from '../styles/OrdersStyles';
import OrderItem from '../components/OrderItem'; 

const Colors = {
  Pending: '#FE9900',
  Paid: '#FFDE59', 
  Prepared: '#A9DC58', 
  Delivered: '#4CDE3B',
  Grey: '#333333',        
  Success: 'lightgreen',     
  Confirmed: 'darkgreen', 
  Error: '#E4080A',        
  Info: '#555555',      
  Primary: '#007AFF',
};

const OrdersScreen = () => {
  const route = useRoute();
  const { orders = [], onRefresh, refreshing } = route.params || {};
  const [ ordersList, setOrdersList ] = useState(orders);
  const [error] = useState(null);
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);
  const styles = useMemo(() => getStyles(darkMode), [darkMode]);
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'upcoming', title: 'Upcoming Orders' },
    { key: 'past', title: 'Past Orders' },
  ]);

  const pastOrders = useMemo(() => {
    return ordersList.filter(order => {
      return ['com', 'can', 'nos', 'del'].includes(order.status?.toLowerCase());
    });
  }, [ordersList]);

  const upcomingOrders = useMemo(() => {
    return ordersList.filter(order => {
      return ['pen', 'pai', 'con', 'pre'].includes(order.status?.toLowerCase());
    });
  }, [ordersList]);

  useEffect(() => {
    const initializeOrdersList = async () => {
      const data = await handleRefresh();
      console.log('Orders data:', data);
      if (data) {
        setOrdersList(data);
      }
    };
  
    initializeOrdersList();
  }, []);

  const handleOrderPress = useCallback((order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    const data = await onRefresh();
    if (data) {
      setOrdersList(data);
    }
  }, [onRefresh]);

  const getStatusColor = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'pen': return Colors.Pending;
      case 'pai': return Colors.Paid;
      case 'con': return Colors.Confirmed;
      case 'pre': return Colors.Prepared;
      case 'del': return Colors.Info;
      case 'com': return Colors.Confirmed;
      case 'can': return Colors.Error;
      case 'nos': return Colors.Error;
      default: return Colors.Grey;
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

  const renderScene = useCallback(({ route: sceneRoute }) => {
    const currentOrders = sceneRoute.key === 'past' ? pastOrders : upcomingOrders;
    
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
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
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
              onRefresh={handleRefresh}
              colors={[Colors.Primary]}
              tintColor={Colors.Primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {sceneRoute.key === 'past' ? 'No past orders found.' : 'No upcoming orders found.'}
              </Text>
            </View>
          }
        />
      </View>
    );
  }, [pastOrders, upcomingOrders, refreshing, error, styles, renderOrderItem, keyExtractor, handleRefresh]);

  const renderTabBar = useCallback(props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: styles.tabBar.indicatorColor }}
      style={{ backgroundColor: styles.tabBar.backgroundColor}}
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
          <Text style={styles.title}>My Orders</Text>
        </View>
        
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ 
            width: Dimensions.get('window').width,
            height: 0 
          }}
          swipeEnabled={true}
          lazy={true} 
        />
      </View>
    </>
  );
};

export default OrdersScreen;