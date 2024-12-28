import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "./utils/colors";
import { fonts } from "./utils/fonts";
import { useRouter } from "expo-router";
import API from './utils/api';

const CodeVerificationScreen = () => {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await API.post('/api/password/verify-reset-code', { code });
  
      if (response.status === 200) {
        const { token } = response.data; // Récupérer le token depuis la réponse
        router.push(`./ResetpasswordScreen/${token}`);

                // router.push(`./AddExpence?expenseId=${expenseId}`);

      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify the code.');
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
        <Text style={styles.headingText}>Enter Verification Code</Text>
        <Text style={styles.subText}>We have sent a 6-digit code to your email.</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"key-outline"} size={30} color={"#999"} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonWrapper}>
          <Text style={styles.submitText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


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
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fonts.Regular,
    textAlign: "center",
    marginTop: 10,
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
  submitButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  submitText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
});
export default CodeVerificationScreen;
