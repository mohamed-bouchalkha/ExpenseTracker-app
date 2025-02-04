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
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import { useRouter } from "expo-router";
import API from "./utils/api";

const CodeVerificationScreen = () => {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await API.post("/api/password/verify-reset-code", { code });
      if (response.status === 200) {
        const { token } = response.data;
        router.push(`./ResetpasswordScreen/${token}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify the code.");
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>We have sent a 6-digit code to your email.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Verification Code</Text>
              <View style={[styles.inputContainer, code && styles.inputContainerActive]}>
                <Ionicons name="key-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  maxLength={6}
                  autoCapitalize="none"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Verify</Text>
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
    backgroundColor: "#FFFFFF",
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
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.Bold,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  form: {
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.Semibold,
    color: colors.text,
    marginLeft: 4,
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
  inputContainerActive: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
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
    marginTop: 8,
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
    letterSpacing: 0.5,
  },
});

export default CodeVerificationScreen;