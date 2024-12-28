import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // For Date Picker
import moment from "moment"; // For formatting the date
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "./utils/colors";

const SetGoalScreen = () => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAmountChange = (text: string) => {
    // You can add validation for the amount input if needed
    setAmount(text);
  };

  const handleSubmit = () => {
    // Handle the form submission (for example, store the date and amount)
    console.log("Selected Date:", moment(date).format("YYYY-MM-DD"));
    console.log("Amount:", amount);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
        <Ionicons name={"arrow-back-outline"} color={"#000"} size={25} />
      </TouchableOpacity>

      {/* Page Content */}
      <Text style={styles.title}>Set Date and Amount</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {moment(date).format("YYYY-MM-DD")}
          </Text>
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
    position: "relative", // Ensures absolute positioning for back button works
  },

  // Back Button Styling
  backButtonWrapper: {
    position: "absolute", // Position it relative to the container
    top: 20, // Adjust the top margin to your preference
    left: 20, // Adjust the left margin to your preference
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Make sure the button stays on top of other components
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
