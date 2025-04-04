import React, { useState, useEffect, useRef } from "react";
import { View, Appearance, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { getToken, storeToken, removeToken } from "../utils/token";
import { FontAwesome6 } from "@expo/vector-icons";
import getStyles from "../styles/SettingsStyles";

const SettingsScreen = ( ) => {
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

  const actualPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const togglePasswordVisibility = (field) => {
    if (field === "actual") {
      setShowActualPassword(!showActualPassword);
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirm") {
      setShowConfirmNewPassword(!showConfirmNewPassword);
    }
  };

  const renderPasswordInput = (placeholder, value, onChangeText, isPasswordVisible, toggleVisibility, ref, nextRef = null, handleSavePassword = null) => (
    <View style={[styles.input, styles.editableInputContainer]}>
      <TextInput
        ref={ref}
        style={styles.editableInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        placeholderTextColor={styles.editableInput.placeholderTextColor}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={ nextRef ? "next" : "done" }
        onSubmitEditing={() => {
          if (nextRef) {
            nextRef.current.focus();
          }
          else{
            handleSavePassword?.();
          }
        }}
        submitBehavior="submit"
      />
      <TouchableOpacity onPress={toggleVisibility} style={styles.eyeIconContainer}>
        <FontAwesome6 name={isPasswordVisible ? "eye-slash" : "eye"} size={styles.eyeIcon.size} color={styles.eyeIcon.color} />
      </TouchableOpacity>
    </View>
  );

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

  const handleSavePassword = async () => {
    if (!actualPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    // Verify that the password is strong enough
    // At least 8 characters long, at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@#$%^&+=!]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    try {
      // TODO : Replace with our API endpoint
      // const response = await fetch("", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${await getToken()}`,
      //   },
      //   body: JSON.stringify({ "oldPassword": actualPassword, "newPassword": newPassword }),
      // });

      // Fake response for demonstration purposes
      const response = {
        status: 200,
        ok: true,
      }

      if (response.status === 401) {
        alert("Incorrect password");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      console.log("Mise à jour avec succès");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }

    setEditablePassword(false);
    setActualPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.settingsGlobalContainer}>
        <View style={styles.titleContainer}>
          <FontAwesome6 name="gear" size={styles.gearIcon.size} color={styles.gearIcon.color} style={styles.gearIcon} />
          <Text style={styles.settingsTitle}>
            Personal information
          </Text>
        </View>
        <View style={styles.settingsFormContainer}>
          <View style={[styles.input, styles.editableInputContainer]}>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              editable={editableFirstName}
              placeholder="First Name"
              style={styles.editableInput}
            />
            <TouchableOpacity
              onPress={() => {
                if (editableFirstName) {
                  handleSave();
                } else {
                  setEditableFirstName(true);
                }
              }}
              style={styles.editIconContainer}
              hitSlop={styles.editIconContainer.hitSlop}
            >
              {editableFirstName ? (
                <FontAwesome6 name="check" size={styles.editIcon.size} color={styles.editIcon.color} />
              ) : (
                <FontAwesome6 name="pen" size={styles.editIcon.size} color={styles.editIcon.color} />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.input, styles.editableInputContainer]}>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              editable={editableLastName}
              placeholder="Last Name"
              style={styles.editableInput}
            />
            <TouchableOpacity
              onPress={() => {
                if (editableLastName) {
                  handleSave();
                } else {
                  setEditableLastName(true);
                }
              }}
              style={styles.editIconContainer}
              hitSlop={styles.editIconContainer.hitSlop}
            >
              {editableLastName ? (
                <FontAwesome6 name="check" size={styles.editIcon.size} color={styles.editIcon.color} />
              ) : (
                <FontAwesome6 name="pen" size={styles.editIcon.size} color={styles.editIcon.color} />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={[styles.input, styles.editableInputContainer]}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              editable={editableEmail}
              placeholder="Email"
              style={styles.editableInput}
            />
            <TouchableOpacity
              onPress={() => {
                if (editableEmail) {
                  handleSave();
                } else {
                  setEditableEmail(true);
                }
              }}
              style={styles.editIconContainer}
              hitSlop={styles.editIconContainer.hitSlop}
            >
              {editableEmail ? (
                <FontAwesome6 name="check" size={styles.editIcon.size} color={styles.editIcon.color}/>
              ) : (
                <FontAwesome6 name="pen" size={styles.editIcon.size} color={styles.editIcon.color}/>
              )}
            </TouchableOpacity>
          </View>

          {
            editablePassword ? (
              <View style={styles.editablePasswordContainer}>
                {renderPasswordInput("Actual Password", actualPassword, setActualPassword, showActualPassword, () => togglePasswordVisibility("actual"), actualPasswordRef, newPasswordRef)}
                {renderPasswordInput("New Password", newPassword, setNewPassword, showNewPassword, () => togglePasswordVisibility("new"), newPasswordRef, confirmNewPasswordRef)}
                {renderPasswordInput("Confirm Password", confirmNewPassword, setConfirmNewPassword, showConfirmNewPassword, () => togglePasswordVisibility("confirm"), confirmNewPasswordRef, null, handleSavePassword)}

                <View style={{width: "80%", flexDirection: "row", justifyContent: "space-between"}}>
                  <TouchableOpacity
                    onPress={
                      () => {setEditablePassword(false);}
                    }
                    style={[styles.input, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={
                      handleSavePassword
                    }
                    style={[styles.input, styles.submitButton]}
                  >
                    <Text style={styles.submitButtonText}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.input, styles.editableInputContainer]}>
                <TextInput
                  value={"●".repeat(10)}
                  editable={false}
                  style={styles.editableInput}
                />
                <TouchableOpacity
                  onPress={() => {
                    setEditablePassword(true);
                  }}
                  style={styles.editIconContainer}
                  hitSlop={styles.editIconContainer.hitSlop}
                >
                  {editablePassword ? (
                    <FontAwesome6 name="check" size={styles.editIcon.size} color={styles.editIcon.color} />
                  ) : (
                    <FontAwesome6 name="pen" size={styles.editIcon.size} color={styles.editIcon.color} />
                  )}
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        <View />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
