import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "./utils/colors2";
import API from "./utils/api"; // Your Axios instance
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Icon from 'react-native-vector-icons/Ionicons'; // For example, using Ionicons


const SetGoalScreen = () => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // For loading state
  const [monthlyGoals, setMonthlyGoals] = useState<any[]>([]); // State for goals
  const [fetchingGoals, setFetchingGoals] = useState(false); // Loading state for fetching goals

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
      const token = await AsyncStorage.getItem("authToken"); // Get token if necessary
      const userID = await AsyncStorage.getItem("userID"); // Get userID if necessary

      const payload = {
        userID,
        targetDate: moment(date).format("YYYY-MM-DD"),
        amount: parseFloat(amount),
      };

      const response = await API.post("api/goals/addgoals", payload, {
        headers: { Authorization: `Bearer ${token}` }, // Add token if required
      });

      if (response.status === 201) {
        alert("Goal saved successfully!");
        setAmount("");
        setDate(new Date());
        fetchMonthlyGoals(); // Refresh goals after adding
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show the error message from the backend
      } else {
        console.error("Error saving goal:", error);
        alert("An error occurred while saving the goal.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyGoals = async () => {
    setFetchingGoals(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userID = await AsyncStorage.getItem("userID");

      const response = await API.get("api/goals/getMonthlyGoals", {
        headers: { Authorization: `Bearer ${token}` },
        params: { userID },
      });

      setMonthlyGoals(response.data);
    } catch (error) {
      console.error("Error fetching monthly goals:", error);
      alert("Failed to fetch monthly goals.");
    } finally {
      setFetchingGoals(false);
    }
  };



  const handleDeleteGoal = async (goalId: string) => {
    // Afficher la boîte de dialogue pour confirmation
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Effectuer la requête DELETE pour supprimer l'objectif
              const response = await API.delete(`/api/goals/deletegoal/${goalId}`);
              if (response.status === 200) {
                // Mettre à jour la liste des objectifs après la suppression
                setMonthlyGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
                alert('Goal deleted successfully');
  
                // Rafraîchir les objectifs après suppression (si nécessaire)
                fetchMonthlyGoals();  // Fonction pour récupérer les objectifs depuis l'API
              }
            } catch (error) {
              console.error('Error deleting goal:', error);
              alert('Error deleting goal');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchMonthlyGoals();
  }, []);

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
        style={[styles.submitButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>{loading ? "Saving..." : "Submit"}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Monthly Goals:</Text>
      {fetchingGoals ? (
        <ActivityIndicator size="large" color={colors.PURPLE[500]} />
      ) : (
        <FlatList
          data={monthlyGoals}
          horizontal={true} // Enables horizontal scrolling
          keyExtractor={(item) => item._id.toString()} // Ensure the key is unique
          renderItem={({ item }) => (
            <View style={styles.goalCard}>
              <Text style={styles.goalMonth}>
                {moment().month(item._id - 1).format("MMMM")}
              </Text>
              {item.goals.map((goal: any) => (
                <View key={goal._id} style={styles.goalItemContainer}>
                  <Text style={styles.goalItem}>
                    {moment(goal.targetDate).format("DD MMM")}:{goal.amount} DH
                  </Text>
                  <View style={styles.goalActions}>
                    <TouchableOpacity             onPress={() =>
                    router.push({ pathname: "/Editgoals/[id]", params: { id: goal._id } })
                  }style={styles.editButton}>
                      <Icon name="pencil" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteGoal(goal._id)} style={styles.deleteButton}>
                      <Icon name="trash" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={styles.flatListContent} // Adjusts spacing between items
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Adjusted to ensure proper spacing
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 310,
    paddingHorizontal: 20,
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
    position: "absolute",
    top: 150,
    
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 25,
  },
  flatListContent: {
    paddingBottom: 10,
  },

  goalCard: {
    backgroundColor: "#fff",
    marginRight: 10,
    padding: 6, 
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: 200, // Fixed width
    height: 100, // Fixed height for smaller cards
    justifyContent: "center", // Center content vertically
    marginBottom: 15, // Space between cards
  },
  goalMonth: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4, // Reduced space
    color: "#333",
  },
  goalItemContainer: {
    marginBottom: 10,
  },
  goalItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  goalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: colors.BLUE[500],
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: colors.PINK[500],
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default SetGoalScreen;
