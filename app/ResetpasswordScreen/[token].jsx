import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import API from "../utils/api";
import { useRouter, usePathname } from "expo-router";

const ResetPasswordScreen = () => {
  const pathname = usePathname();
  const token = pathname.split("/").pop();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      const response = await API.post("/api/password/reset-password", {
        token,
        password: newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Your password has been successfully reset.");
        router.push("/LoginScreen");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reset the password.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Reset Your Password</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={secureEntry}
                placeholderTextColor={colors.textTertiary}
              />
              <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
                <Ionicons
                  name={secureEntry ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureEntry}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    color: colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  submitButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: "#FFFFFF",
  },
});

export default ResetPasswordScreen;