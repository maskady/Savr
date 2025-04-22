import React, {useEffect, useState} from "react";
import { View, Button, InputAccessoryView, Keyboard, Appearance } from "react-native";
import getStyles from '../styles/AppStyles';

const IOSKeyboardToolbar = ({ inputAccessoryViewID }) => {
  const [styles, setStyles] = useState(getStyles());
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => setStyles(getStyles()));
    return () => sub.remove();
  }, []);
  
  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.iosKeyboardToolbar.toolbarContainer}>
        <Button onPress={() => Keyboard.dismiss()} title="Close" />
      </View>
    </InputAccessoryView>
  );
};

export default IOSKeyboardToolbar;