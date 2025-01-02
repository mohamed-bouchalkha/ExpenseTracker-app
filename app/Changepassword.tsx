import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import de AsyncStorage
import API from './utils/api';  // Import de ton API

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Récupérer le token et l'ID utilisateur stockés dans AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      const userID = await AsyncStorage.getItem("userID");

      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      // Effectuer la requête API pour changer le mot de passe
      const response = await API.post(
        "/api/auth/change-password",
        {
          oldPassword,
          newPassword,
          userID,  // Passer l'ID utilisateur dans la requête
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Ajouter le token dans les en-têtes pour l'authentification
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully.");
        router.push("/LoginScreen");  // Redirige vers la page principale
      }
    } catch (error) {
      console.error("Error:", (error as any).response?.data || error);
      Alert.alert("Error", "Failed to change password.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={() => router.back()}
      >
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Change Your Password</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Champ pour l'ancien mot de passe */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!oldPasswordVisible} // Utilise la visibilité du mot de passe
          />
          <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
            <Ionicons
              name={oldPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={25}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Champ pour le nouveau mot de passe */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!newPasswordVisible} // Utilise la visibilité du mot de passe
          />
          <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
            <Ionicons
              name={newPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={25}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Champ pour la confirmation du mot de passe */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible} // Utilise la visibilité du mot de passe
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons
              name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={25}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonWrapper}>
          <Text style={styles.submitText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  textContainer: {
    marginTop: 80,
    marginBottom: 40,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  formContainer: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  submitButtonWrapper: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ChangePasswordScreen;
