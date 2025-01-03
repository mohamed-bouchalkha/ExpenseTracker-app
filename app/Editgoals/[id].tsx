import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; // Utiliser `useLocalSearchParams`
import colors from "../utils/colors2";
import API from "../utils/api"; // Axios instance
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditGoalScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Récupérer l'ID depuis les paramètres locaux

  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGoalDetails();
    } else {
      Alert.alert("Error", "Goal ID is missing.");
      router.back();
    }
  }, [id]);

  const fetchGoalDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await API.get(`api/goals/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { targetDate, amount } = response.data;
      setDate(new Date(targetDate));
      setAmount(amount.toString());
    } catch (error) {
      console.error("Error fetching goal details:", error);
      Alert.alert("Error", "Failed to fetch goal details.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAmountChange = (text: string) => {
    setAmount(text);
  };

  const handleSaveChanges = async () => {
    if (!amount || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      // Vérification de l'ID du but
      if (!id) {
        console.error("Goal ID is missing");
        return;
      }
  
      // Préparation des données à envoyer
      const payload = {
        targetDate: moment(date).format("YYYY-MM-DD"), // Format de la date
        amount: parseFloat(amount), // Montant converti en float
      };
  
      // Envoi de la requête PUT
      const response = await API.put(`/api/goals/editgoal/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        Alert.alert("Success", "Goal updated successfully!");
        router.back(); // Retourne à la page précédente
      
      } else {
        console.error("Error updating goal:", response.data);
        Alert.alert("Error", response.data.message || "An error occurred while updating the goal.");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      Alert.alert("Error", "An error occurred while updating the goal.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Goal</Text>

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
        style={[styles.submitButton, loading && { backgroundColor: "#ccc" }]}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
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
  },
  backButtonWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
    height: 40,
    width: 40,
    backgroundColor: "purple",
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
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default EditGoalScreen;
