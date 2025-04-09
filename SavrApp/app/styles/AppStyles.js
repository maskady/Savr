import { StyleSheet } from 'react-native';

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
  },
  flexContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  }
});

const localStyles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative'
  },
  searchOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 100,
  }
});

export default styles;