import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import API from "./utils/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await API.post("/api/authv/login", { email, password });
      if (response.status === 200) {
        const { token, userID } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userID', userID);
        router.push("/MainScreen");
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  };

  const handleSignup = () => router.push("/SignupScreen");
  const handleForgot = () => router.push("/EmailScreen");

  useEffect(() => {
    const resetLoginState = async () => {
      setEmail('');
      setPassword('');
      await AsyncStorage.clear();
    };
    resetLoginState();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
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
                placeholder="Enter your password"
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

          <TouchableOpacity 
            style={styles.forgotButton} 
            onPress={handleForgot}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 12,
  },
  inputContainerActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 14,
    fontFamily: fonts.Semibold,
    color: colors.primary,
  },
  loginButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
  signupText: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.primary,
  },
});

export default LoginScreen;