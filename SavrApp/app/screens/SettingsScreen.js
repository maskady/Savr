import React, { useState, useEffect, useRef } from "react";
import { View, Appearance, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { getToken, storeToken, removeToken } from "../utils/token";
import { FontAwesome6 } from "@expo/vector-icons";
import getStyles from "../styles/SettingsStyles";

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [editableFirstName, setEditableFirstName] = useState(false);
  const [editableLastName, setEditableLastName] = useState(false);
  const [editableEmail, setEditableEmail] = useState(false);
  const [editablePassword, setEditablePassword] = useState(false);

  const [styles, setStyles] = useState(getStyles());

  const [showActualPassword, setShowActualPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // TODO : Replace with our API endpoint
        // const response = await fetch("", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${await getToken()}`,
        //   },
        // });
        // const data = await response.json();

        // Fake response for demonstration purposes
        const response = {
          data: {
            role: "user",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@domain.com",
          },
          ok: true,
        }
        const data = response.data;

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        console.log("User data:", data);
        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigation.navigate("Error", { error: "Failed to load user data" });
      }
    };

    const handleThemeChange = ({ colorScheme }) => {
      console.log("Theme changed:", colorScheme);
      if (colorScheme) {
        setStyles(getStyles()); 
      }
    };

    loadUserData();
    const subscription = Appearance.addChangeListener(handleThemeChange);

    return () => {
      subscription.remove();
    };

  }, []);

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={styles.loader.color}/>
      </View>
    );
  }

  const handleSave = async () => {
    try {
      // TODO : Replace with our API endpoint
      // const response = await fetch("", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${await getToken()}`,
      //   },
      //   body: JSON.stringify({ fullName, email }),
      // });
      //
      // const data = await response.json();

      const response = {
        ok: true,
        data: {
          token: "new_token",
        },
      }
      const data = response.data;

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      // Update the token with the new data
      await removeToken();
      await storeToken(data.token);
      console.log("Mise à jour avec succès");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }

    // After saving, set the editable states to false
    setEditableFirstName(false);
    setEditableLastName(false);
    setEditableEmail(false);
  };
};

export default SettingsScreen;
