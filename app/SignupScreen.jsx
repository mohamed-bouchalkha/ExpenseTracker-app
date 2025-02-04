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
import React, { useState } from "react";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import API from "./utils/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

  const handleSignup = async () => {
    try {
      const response = await API.post("/api/authv/register", {
        firstName: firstname,
        lastName: lastname,
        email,
        password,
      });
      if (response.status === 201) {
        Alert.alert("Verification code sent to your email!");
        navigation.navigate("VerificationCodeScreen");
      }
    } catch (error) {
      Alert.alert("Error", "Signup failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>First Name</Text>
              <View style={[styles.inputContainer, firstname && styles.inputContainerActive]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={firstname}
                  onChangeText={setFirstname}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Last Name</Text>
              <View style={[styles.inputContainer, lastname && styles.inputContainerActive]}>
                <Ionicons name="person-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  value={lastname}
                  onChangeText={setLastname}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputContainer, email && styles.inputContainerActive]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputContainer, password && styles.inputContainerActive]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  secureTextEntry={secureEntry}
                  value={password}
                  onChangeText={setPassword}
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
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginText}>Sign In</Text>
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
  signupButton: {
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
  signupText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  loginText: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.primary,
  },
});

export default SignupScreen;
