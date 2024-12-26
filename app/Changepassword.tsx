import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router"; // Remove useSearchParams as it's not needed here
import API from './utils/api';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await API.post('/change-password', {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully.');
        router.replace('/LoginScreen'); // Redirect to the login page
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to change password.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Change Your Password</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Old Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>

        {/* Confirm New Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name={"lock-closed-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonWrapper}>
          <Text style={styles.submitText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  backButtonWrapper: {
    marginTop: 20,
    marginLeft: 10,
  },
  textContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  formContainer: {
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
  },
  submitButtonWrapper: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
