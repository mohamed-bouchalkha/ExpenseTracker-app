import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Importation de useRouter
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";

const Index = () => {
  const router = useRouter(); // Utilisation de useRouter

  const handleLogin = () => {
    router.push("/LoginScreen"); // Redirige vers la page de login
  };

  const handleSignup = () => {
    router.push("/SignupScreen"); // Redirige vers la page d'inscription
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/med.jpg")} style={[styles.logo, { opacity: 0 }]} />
      <Image source={require("./assets/expenselogo.png")} style={styles.bannerImage} />

      <Text style={styles.title}>Simplified Expense Tracking.</Text>
      <Text style={styles.subTitle}>
      Manage your finances effortlessly and track your expenses in real time.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.loginButtonWrapper, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 140,
    marginVertical: 30,
  },
  bannerImage: {
    marginVertical: 20,
    height: 250,
    width: 231,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#4B0082",
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.Medium,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#4B0082",
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});