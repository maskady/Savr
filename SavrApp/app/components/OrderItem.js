import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const OrderItem = React.memo(({ order, onPress, styles, formatDate, getStatusColor }) => {
  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => onPress(order)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderInfo}>Price: {order.price} {order.currencyId}</Text>
        <Text style={styles.orderInfo}>Created: {formatDate(order.dtcreated)}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default OrderItem;