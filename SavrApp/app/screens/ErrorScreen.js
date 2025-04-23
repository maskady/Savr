import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import getStyles from '../styles/ErrorStyles';
import SettingsContext from '../contexts/SettingsContext';

const ErrorScreen = () => {
  const navigation = useNavigation();
  const { darkMode } = useContext(SettingsContext);
  const [ styles, setStyles ] = useState(getStyles(darkMode));

  useEffect(() => {
    setStyles(getStyles(darkMode));
  }, [darkMode]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA2L2pvYjIwNS1iZWUtMTBjLmpwZw.jpg' }}
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
