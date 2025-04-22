import React from "react";
import { View, Button, InputAccessoryView, Keyboard } from "react-native";
import getStyles from '../styles/AppStyles';

const IOSKeyboardToolbar = ({ inputAccessoryViewID }) => {
  const styles = getStyles();
  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View style={styles.iosKeyboardToolbar.toolbarContainer}>
        <Button onPress={() => Keyboard.dismiss()} title="Close" />
      </View>
    </InputAccessoryView>
  );
};

export default IOSKeyboardToolbar;