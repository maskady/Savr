import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Appearance, SafeAreaView, Text, ActivityIndicator, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import storeToken, { getToken,  removeToken, refreshToken } from "../utils/token";
import { FontAwesome6 } from "@expo/vector-icons";
import getStyles from "../styles/SettingsStyles";
import AddOptionsDropdown from "../components/AddOptionsDropdown";
import { saveUserData } from "../utils/api";
import AuthContext from "../contexts/AuthContext";
import SettingsContext from "../contexts/SettingsContext";

const SettingsScreen = () => {
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

  const { darkMode } = useContext(SettingsContext);
  const [styles, setStyles] = useState(getStyles());

  const [showActualPassword, setShowActualPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const actualPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const navigation = useNavigation();

  const { user, setUser } = useContext(AuthContext);

  const logout = async () => {
    try {
      removeToken();
      console.log("Token removed successfully");
      navigation.navigate("Auth");
    } catch (error) {
      console.error("Error removing token:", error);
      navigation.navigate("Error", { error: "Failed to log out" });
    }
  };

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
        returnKeyType={nextRef ? "next" : "done"}
        onSubmitEditing={() => {
          if (nextRef) {
            nextRef.current.focus();
          }
          else {
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

  useEffect(() => {
    console.log("[SettingsScreen] UseEffect triggered: user:", user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);

    setStyles(getStyles(darkMode));

  }, [darkMode]);

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={styles.loader.color} />
      </View>
    );
  }

  const handleSave = async () => {
    try {
      const { response } = await saveUserData({ firstName, lastName, email });
      if (response.status === 409) {
        alert("Email already exists");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
  
      // Refresh token
      const token = await getToken();
      const tokenData = await refreshToken(token);
      console.log("[SettingsScreen] Token data:", tokenData.data.data);
      const newToken = await tokenData.data.data.token;
      setUser(tokenData.data.data);

      if (newToken) {
        await removeToken();
        await storeToken(newToken);
      }
      else{
        throw new Error("[SettingsScreen] Token not found in response data");
      }
      console.log("[SettingsScreen] User data updated successfully and token refreshed.");

    } catch (error) {
      console.error("[SettingsScreen] Error updating user data:", error);
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
      const response = await fetch("https://www.sevr.polaris.marek-mraz.com/api/user/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ "oldPassword": actualPassword, "newPassword": newPassword }),
      });

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



  const handleCreateShop = () => {
    navigation.navigate("ShopCreation", { companyId: user.companyId });
  };

  const handleCreateCompany = () => {
    navigation.navigate("CompanyCreation");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={styles.statusBar.barStyle}
        backgroundColor={styles.statusBar.backgroundColor}
      />
      <View style={styles.settingsGlobalContainer}>
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: "row"}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome6 name="arrow-left" size={styles.backIcon.size} color={styles.backIcon.color} />
            </TouchableOpacity>
            <FontAwesome6 name="gear" size={styles.gearIcon.size} color={styles.gearIcon.color} style={styles.gearIcon} />
          </View>
          
          <Text style={styles.settingsTitle}>
            Personal information
          </Text>
          <AddOptionsDropdown
            onCreateCompany={handleCreateCompany}
            onCreateShop={handleCreateShop}
            role={user.roleId}
          />
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
              autoCapitalize="none"
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
                <FontAwesome6 name="check" size={styles.editIcon.size} color={styles.editIcon.color} />
              ) : (
                <FontAwesome6 name="pen" size={styles.editIcon.size} color={styles.editIcon.color} />
              )}
            </TouchableOpacity>
          </View>

          {
            editablePassword ? (
              <View style={styles.editablePasswordContainer}>
                {renderPasswordInput("Actual Password", actualPassword, setActualPassword, showActualPassword, () => togglePasswordVisibility("actual"), actualPasswordRef, newPasswordRef)}
                {renderPasswordInput("New Password", newPassword, setNewPassword, showNewPassword, () => togglePasswordVisibility("new"), newPasswordRef, confirmNewPasswordRef)}
                {renderPasswordInput("Confirm Password", confirmNewPassword, setConfirmNewPassword, showConfirmNewPassword, () => togglePasswordVisibility("confirm"), confirmNewPasswordRef, null, handleSavePassword)}

                <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-between" }}>
                  <TouchableOpacity
                    onPress={
                      () => { setEditablePassword(false); }
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

          <TouchableOpacity onPress={logout} style={[styles.input, styles.logoutButton]}>
            <Text style={styles.logoutButtonText}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
        <View />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
