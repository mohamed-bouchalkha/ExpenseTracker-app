import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../utils/api";

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { token } = useSearchParams();

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Invalid or missing token.");
      return;
    }

    try {
      const response = await API.post(`/reset-password/${token}`, { password: newPassword });

      if (response.status === 200) {
        Alert.alert("Success", "Password reset successfully.");
        router.replace("/login"); // Redirection vers la page de connexion
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to reset password.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" color="#000" size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Reset Your Password</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={30} color="#999" />
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={30} color="#999" />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonWrapper}>
          <Text style={styles.submitText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  backButtonWrapper: { marginBottom: 20 },
  textContainer: { marginBottom: 20 },
  headingText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  formContainer: { marginTop: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  textInput: { flex: 1, borderBottomWidth: 1, paddingHorizontal: 10 },
  submitButtonWrapper: { backgroundColor: "#007BFF", borderRadius: 10, padding: 15 },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default ResetPasswordScreen;
