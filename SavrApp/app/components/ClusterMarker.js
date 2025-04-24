import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text } from 'react-native';
import getStyles from '../styles/AppStyles';

export default React.memo(function ClusterMarker({ cluster, onPress, size }) {
  const styles = getStyles();
  const [longitude, latitude] = cluster.geometry.coordinates;
  const { point_count: pointCount } = cluster.properties;

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={onPress}
    >
      <View 
        style={[
          styles.clusterContainer, 
          {
            backgroundColor: '#ffbb00', 
            width: size, 
            height: size,
            borderRadius: size/2,
            zIndex: 999
          }
        ]}
      > 
        <Text style={[styles.clusterText, {color: '#000000', fontSize: pointCount > 99 ? 12 : 14}]}>
          {pointCount > 99 ? '99+' : pointCount}
        </Text>
      </View>
    </Marker>
  );
}, (prev, next) => {
  const isEqual = prev.cluster.id === next.cluster.id;
  return isEqual;
}); 