import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import API from "./utils/api"; // Votre instance Axios
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";  // Importation de useRouter
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";

const LoginScreen = () => {
  const router = useRouter();  // Utilisation de useRouter pour la navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await API.post("/api/authv/login", { email, password });
  
      if (response.status === 200) {
        const { token, userID } = response.data;
  
        // Stocker le token et l'ID utilisateur dans AsyncStorage ou dans un état global
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userID', userID);
    
        // Poursuivre avec la navigation ou autres actions
        console.log('User ID:', userID);
        console.log('User token:', token);

        Alert.alert("Success", "Login Successful!");
        router.push("/MainScreen");  // Redirige vers la page MainScreen
      }
    } catch (error) {
      console.error("Login Error: ", error.response?.data || error.message);
      Alert.alert("Error", "Login Failed. Please check your credentials.");
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSignup = () => {
    router.push("/SignupScreen"); // Redirige vers la page d'inscription
  };
  const handleforget = () => {
    router.push("/EmailScreen"); // Redirige vers la page d'inscription
  };  
  useEffect(() => {
    const resetLoginState = async () => {
      setEmail('');
      setPassword('');
      await AsyncStorage.clear(); // Supprime tous les éléments persistants.
    };
    resetLoginState();
  }, []);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome</Text>
        <Text style={styles.headingText}>Back</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <SimpleLineIcons name={secureEntry ? "eye" : "eye-off"} size={20} color={"#999"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleforget}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButtonWrapper}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image
            source={require("./assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
});