import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "./utils/colors";
import API from "./utils/api"; // Votre instance Axios
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import pour AsyncStorage

const SetGoalScreen = () => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Pour indiquer l'état de chargement

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken'); // Récupérer le token si nécessaire
      const userID = await AsyncStorage.getItem('userID'); // Récupérer l'ID utilisateur si nécessaire
  
      const payload = {
        userID, 
        targetDate: moment(date).format("YYYY-MM-DD"),
        amount: parseFloat(amount),
      };
  
      const response = await API.post("api/goals/addgoals", payload, {
        headers: { Authorization: `Bearer ${token}` }, // Ajouter le token dans l'en-tête si requis
      });
  
      if (response.status === 201) {
        alert("Goal saved successfully!");
        setAmount("");
        setDate(new Date());
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Afficher le message d'erreur renvoyé par le back-end
      } else {
        console.error("Error saving goal:", error);
        alert("An error occurred while saving the goal.");
      }
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      <Text style={styles.title}>Set Date and Amount</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{moment(date).format("YYYY-MM-DD")}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Amount:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={handleAmountChange}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && { backgroundColor: colors.gray }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? "Saving..." : "Submit"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
    position: "relative",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  datePicker: {
    width: "100%",
    marginTop: 10,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#10b981",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SetGoalScreen;
