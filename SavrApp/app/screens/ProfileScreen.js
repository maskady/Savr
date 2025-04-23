// TODO: Refactor styles
import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Appearance,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-chart-kit';
import SettingsDropdown from '../components/SettingsDropdown';
import getStyles from '../styles/AppStyles';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../contexts/AuthContext';
import request from '../utils/request';
import SettingsContext from '../contexts/SettingsContext';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const totalAmountSpent = useMemo(
    () => orderHistory.reduce((sum, order) => sum + (order.price || 0), 0),
    [orderHistory]
  );
  const numberOfOrders = orderHistory.length;
  const chartData = useMemo(() => {
    // Not enough records
    if (orderHistory.length <= 1) {
      return { labels: [], data: [], noData: true };
    }
    const msInDay = 24 * 60 * 60 * 1000;
    // Build day-by-day map
    const dates = orderHistory
      .map(o => new Date(o.dtcreated))
      .filter(d => !isNaN(d))
      .sort((a, b) => a - b);
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    if (maxDate - minDate <= msInDay) {
      return { labels: [], data: [], noData: true };
    }
    const thirtyDaysAgo = new Date(Date.now() - 30 * msInDay);
    // Initialize map from start of possible window to maxDate
    const windowStart = new Date(Math.max(minDate.getTime(), thirtyDaysAgo.getTime()));
    windowStart.setHours(0, 0, 0, 0);
    const totalDays = Math.ceil((maxDate - windowStart) / msInDay) + 1;
    const rawData = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(windowStart.getTime() + i * msInDay);
      const key = d.toISOString().split('T')[0];
      rawData.push({ dateKey: key, amount: 0 });
    }
    // Populate daily amounts
    orderHistory.forEach(({ dtcreated, price }) => {
      const d = new Date(dtcreated);
      const key = d.toISOString().split('T')[0];
      const entry = rawData.find(r => r.dateKey === key);
      if (entry) entry.amount += price || 0;
    });
    // Compute cumulative sum and find first non-zero
    const cumulativeData = [];
    rawData.forEach((item, idx) => {
      cumulativeData[idx] = idx === 0 ? item.amount : cumulativeData[idx - 1] + item.amount;
    });
    const firstNonZeroIdx = cumulativeData.findIndex(val => val > 0);
    if (firstNonZeroIdx <= 0) {
      // No valid window
      return { labels: [], data: [], noData: true };
    }
    // Day before first non-zero
    const firstDate = new Date(rawData[firstNonZeroIdx].dateKey);
    const dayBefore = new Date(firstDate.getTime() - msInDay);
    // Final start = later of dayBefore and thirtyDaysAgo
    const finalStart = new Date(Math.max(dayBefore.getTime(), thirtyDaysAgo.getTime()));
    // Filter rawData for the final window
    const filtered = rawData.filter(r => new Date(r.dateKey) >= finalStart);
    // Build labels and final cumulative data
    const labels = [];
    const finalData = [];
    filtered.forEach((item, idx) => {
      const d = new Date(item.dateKey);
      labels.push(d.toLocaleDateString('default', { month: 'short', day: 'numeric' }));
      finalData[idx] = idx === 0 ? item.amount : finalData[idx - 1] + item.amount;
    });
    return { labels, data: finalData, noData: false };
  }, [orderHistory]);
  // Compute a reduced set of X-axis labels to avoid clutter
  const maxLabels = 7;
  const displayLabels = useMemo(() => {
    const labels = chartData.labels;
    const len = labels.length;
    if (len <= maxLabels) return labels;
    const step = Math.ceil(len / maxLabels);
    return labels.map((lbl, idx) =>
      idx % step === 0 || idx === len - 1 ? lbl : ''
    );
  }, [chartData.labels]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles());
  

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
      const { response, data } = await request('/order', 'GET');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      if (data && data.data.length > 0) {
        setOrders(data.data);
        // TODO: change from pending to completed when there is some data in the DB
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
        <Text style={styles.chartTitle}>{t("profile.amountSaved")}</Text>
        {!chartData.noData ? (
          <LineChart
            fromZero
            data={{
              labels: displayLabels,
              datasets: [{ data: chartData.data }],
            }}
            width={screenWidth * 0.9}
            height={200}
            yAxisSuffix="€"
            chartConfig={styles.chartConfig}
            verticalLabelRotation={45}
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
          <Text style={styles.buttonText}>Order History</Text>
        </TouchableOpacity>

      </ScrollView>

      
    </View>
  );
};

export default ProfileScreen;
