import React from "react";
import { View, Button, InputAccessoryView, Keyboard } from "react-native";

const IOSKeyboardToolbar = ({ inputAccessoryViewID }) => {
  return (
    <InputAccessoryView nativeID={inputAccessoryViewID}>
      <View
        style={{
          backgroundColor: "#f1f1f1",
          padding: 6,
          alignItems: "flex-end",
        }}
      >
        <Button onPress={() => Keyboard.dismiss()} title="Close" />
      </View>
    </InputAccessoryView>
  );
};

export default IOSKeyboardToolbar;