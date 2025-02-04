import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import { useRouter } from "expo-router";

const VerifyEmailScreen = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const route = useRoute();
  const router = useRouter();

  useEffect(() => {
    const { token } = route.params;
    if (token) {
      axios
        .get(`http://localhost:5000/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
          setLoading(false);
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Une erreur est survenue.");
          setLoading(false);
        });
    } else {
      setMessage("Token manquant.");
      setLoading(false);
    }
  }, [route.params]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => router.push("/")}
          disabled={loading}
        >
          <Text style={styles.submitText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  messageContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.text,
    textAlign: "center",
  },
  submitButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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

export default VerifyEmailScreen;