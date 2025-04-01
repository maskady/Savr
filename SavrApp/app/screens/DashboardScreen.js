import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-sharp" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>{t("dashboard.tab1")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>{t("dashboard.tab2")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>{t("dashboard.tab3")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>{t("dashboard.tab4")}</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable area (if needed) */}
      <ScrollView style={styles.contentContainer}>
        {/* Top Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>185€</Text>
            <Text style={styles.statLabel}>{t("dashboard.amountSaved")}</Text>
            <Text style={styles.statSubLabel}>32€ this month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Number of boxes</Text>
          </View>
        </View>

        {/* Line Chart: "Amount saved" */}
        <Text style={styles.chartTitle}>{t("dashboard.amountSaved")}</Text>
        <LineChart
          data={{
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [
              {
                data: [20, 30, 50, 60, 80, 100, 150, 200]
              }
            ]
          }}
          width={screenWidth * 0.9}   // 90% of screen width
          height={220}
          yAxisSuffix="€"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#1976D2'
            }
          }}
          bezier
          style={styles.chartStyle}
        />

        {/* CO2 Emissions Bar Chart */}
        <Text style={styles.chartTitle}>{t("dashboard.co2Saved")}</Text>
        <BarChart
        data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
            {
                data: [12, 15, 10, 21, 13],
            },
            ],
        }}
        width={Dimensions.get('window').width * 0.9}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
            borderRadius: 16,
            },
        }}
        style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: 'center',
        }}
        />

      </ScrollView>

      
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 50, // Adjust for notch
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  settingsButton: {
    padding: 8
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10
  },
  tabButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  tabButtonText: {
    fontSize: 14,
    color: '#333'
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  statCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  statSubLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2
  },
  chartTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center'
  },
  co2Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  co2Item: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8
  },
  co2Value: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});