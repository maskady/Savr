import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import styles from '../styles/ErrorStyles';

const ErrorScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA2L2pvYjIwNS1iZWUtMTBjLmpwZw.jpg    ' }}
        style={styles.image}
      />
      <Text style={styles.title}>Whoops, there was an error</Text>
      <Text style={styles.message}>Something went wrong. Please try again later.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Auth")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorScreen;
