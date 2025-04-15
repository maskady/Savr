import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Appearance,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LineChart, BarChart } from 'react-native-chart-kit';
import SettingsDropdown from '../components/SettingsDropdown';
import getStyles from '../styles/AppStyles';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { t } = useTranslation();
  const [styles, setStyles] = useState(getStyles());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setStyles(getStyles(colorScheme));
    });

    return () => subscription.remove();
  }, []);


  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: styles.statusBar.backgroundColor, height: Platform.OS === 'ios' ? 44 : 0 }} />
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
        <SettingsDropdown/>
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
          chartConfig={styles.lineChartConfig}
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
          chartConfig={styles.chartConfig}
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

