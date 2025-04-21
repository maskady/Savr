import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Appearance,
  StatusBar,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SettingsDropdown from '../components/SettingsDropdown';
import getStyles from '../styles/AppStyles';
import { useNavigation } from '@react-navigation/native';
import { businessCategories, businessCategoriesColors } from '../constants/businessCategories';
import CategoryFilter from '../components/CategoryFilter';
import { AuthContext } from '../contexts/AuthContext';
import { request } from '../utils/request';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const totalAmountSpent = useMemo(
    () => orderHistory.reduce((sum, order) => sum + (order.price || 0), 0),
    [orderHistory]
  );
  const numberOfOrders = orderHistory.length;
  const chartData = useMemo(() => {
    // If no or only one record, or all on same day: not enough data
    if (orderHistory.length <= 1) {
      return { labels: [], data: [], noData: true };
    }
    const dates = orderHistory
      .map(o => new Date(o.dtcreated))
      .filter(d => !isNaN(d))
      .sort((a, b) => a - b);
    if (dates.length <= 1) {
      return { labels: [], data: [], noData: true };
    }
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    const msInDay = 24 * 60 * 60 * 1000;
    if (maxDate - minDate <= msInDay) {
      return { labels: [], data: [], noData: true };
    }
    // Determine start date: either oldest record or 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * msInDay);
    const startDate = minDate >= thirtyDaysAgo
      ? new Date(minDate.setHours(0,0,0,0))
      : new Date(thirtyDaysAgo.setHours(0,0,0,0));
    // Build day-by-day map for the range up to today or last record
    const endDate = maxDate;
    const totalDays = Math.ceil((endDate - startDate) / msInDay) + 1;
    const dayMap = {};
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate.getTime() + i * msInDay);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = 0;
    }
    // Aggregate spend per day
    orderHistory.forEach(({ dtcreated, price }) => {
      const d = new Date(dtcreated);
      if (isNaN(d)) return;
      const key = d.toISOString().split('T')[0];
      if (dayMap[key] !== undefined) {
        dayMap[key] += price || 0;
      }
    });
    // Prepare labels and data arrays
    const labels = [];
    const data = [];
    Object.keys(dayMap).forEach(dateKey => {
      const d = new Date(dateKey);
      labels.push(d.toLocaleDateString('default', { month: 'short', day: 'numeric' }));
      data.push(dayMap[dateKey]);
    });
    return { labels, data, noData: false };
  }, [orderHistory]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [styles, setStyles] = useState(getStyles());
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles());
    });
    fetchOrders();

    return () => subscription.remove();
  }, []);

  const fetchOrders = async () => {
    try {
      setError(null);
      const parameters = user.roleId === 'admin' ? null : 'orderUserId=' + user.id;
      const { response, data } = await request('/order', 'GET', null, parameters);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      if (data && data.data.length > 0) {
        setOrders(data.data);
        setOrderHistory(data.data.filter(order => order.status.toLowerCase() === 'pen'));
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  return (
    <View style={styles.container}>
      {/* <View style={{ backgroundColor: styles.statusBar.backgroundColor, height: Platform.OS === 'ios' ? 44 : 0 }} /> */}
      {/* <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      /> */}
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
        <SettingsDropdown/>
      </View>

      {/* Scrollable area (if needed) */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalAmountSpent.toFixed(2)}€</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{numberOfOrders}</Text>
            <Text style={styles.statLabel}>Number of Orders</Text>
          </View>
        </View>

        {/* Line Chart: "Amount saved" */}
        <Text style={styles.chartTitle}>{t("dashboard.amountSaved")}</Text>
        {!chartData.noData ? (
          <LineChart
            fromZero
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.data }],
            }}
            width={screenWidth * 0.9}
            height={220}
            yAxisSuffix="€"
            chartConfig={styles.lineChartConfig}
            bezier
            style={styles.chartStyle}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>
            Not enough data to display
          </Text>
        )}

        <TouchableOpacity 
          style={{backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginTop: 20}} 
          onPress={() => { navigation.navigate('Orders', { orders, setOrders, onRefresh, refreshing, setRefreshing }) }}>
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>

      </ScrollView>

      
    </View>
  );
};

export default DashboardScreen;
