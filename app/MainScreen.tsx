import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  RefreshControl,
} from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import COLORS from "./utils/colors2";
import API from "./utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import Footer from "./FooterNavigationComp";

// Define the Expense interface for proper data typing
interface Expense {
  _id: string;
  categoryID: { name: string };
  amount: number;
  date: string;
}

const HomeScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [month, setMonth] = useState<string>("");
  const [activeFooter, setActiveFooter] = useState<string>("Home");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const monthsScrollRef = useRef<FlatList | null>(null);
  const router = useRouter();

  const fetchExpensesHandler = async (selectedMonth: string = "") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const userID = await AsyncStorage.getItem("userID");

      if (!token || !userID) {
        throw new Error("No token or userID found");
      }

      const response = await API.get("api/expenses/getAllExpenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userID, month: selectedMonth },
      });

      const expensesData: Expense[] = response.data.expenses;
      const total = response.data.totalAmount;

      setExpenses(expensesData);
      setTotalExpenses(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (currentRoute === "MainScreen") {
      setActiveFooter("Home");
    } else if (currentRoute === "GraphReportScreen") {
      setActiveFooter("Graph");
    } else if (currentRoute === "HistoryPage") {
      setActiveFooter("History");
    } else if (currentRoute === "ProfileScreen") {
      setActiveFooter("Profile");
    }

    const onBackPress = () => {
      return false; // Prevent default back action (optional)
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [currentRoute]);

  const updateMonthHandler = async (selectedMonth: string) => {
    setMonth(selectedMonth);
    await fetchExpensesHandler(selectedMonth);
  };

  const handleAddExpense = () => {
    router.push("./AddExpence");
  };

  const handleFooterPress = (label: string, route: string) => {
    setActiveFooter(label);
    if (
      route === "/MainScreen" ||
      route === "/GraphReportScreen" ||
      route === "/ProfileScreen" ||
      route === "/HistoryPage"
    ) {
      router.push(route);
    }
  };
  const handleEditExpense = (expenseId: string) => {
    // Navigate to the AddExpence page with the expenseId as a query parameter
    router.push(`./AddExpence?expenseId=${expenseId}`);
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const userID = await AsyncStorage.getItem("userID");

              if (!token || !userID) {
                throw new Error("No token or userID found");
              }

              await API.delete(`api/expenses/deleteExpense/${expenseId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: { userID },
              });

              setExpenses(expenses.filter((expense) => expense._id !== expenseId));
              Alert.alert("Success", "Expense deleted successfully.");
            } catch (error) {
              console.error("Error deleting expense:", error);
              Alert.alert("Error", "Failed to delete the expense.");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpensesHandler(month);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const userID = await AsyncStorage.getItem("userID");

        if (!token || !userID) {
          router.replace("/LoginScreen");
        }
      };

      checkAuthStatus();

      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [router])
  );

  useEffect(() => {
    fetchExpensesHandler();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <FlatList
                horizontal
                ref={monthsScrollRef}
                showsHorizontalScrollIndicator={false}
                data={moment.months()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => updateMonthHandler(item)}
                    style={[
                      styles.monthButton,
                      month === item && styles.activeMonthButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        month === item && styles.activeMonthText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <>
                <Card.Title
                  title={`Total Expenses:${totalExpenses || 0} DH`}
                  left={(props) => (
                    <Avatar.Icon
                      {...props}
                      icon="wallet"
                      style={{ backgroundColor: "#6c5ce7" }}
                    />
                  )}
                />
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
              </>
            )}
          </>
        }
        data={expenses}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <Card.Content>
              <View style={styles.expenseRow}>
                <Text style={styles.expenseCategory}>{item.categoryID.name}</Text>
                <Text style={styles.expenseAmount}>{item.amount} DH</Text>
              </View>
              <Text style={styles.expenseDate}>
                {moment(item.date).format("DD MMM YYYY")}
              </Text>
              <View style={styles.expenseActions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/EditExpence/[id]", params: { id: item._id } })
                  }
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color={COLORS.PURPLE[600]}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteExpense(item._id)}>
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={24}
                    color={COLORS.PURPLE[600]}
                  />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddExpense}
        color="#fff"
      />
      <Footer activeFooter={activeFooter} handleFooterPress={handleFooterPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: { marginBottom: 20, paddingHorizontal: 16 },
  monthButton: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: COLORS.PURPLE[100],
  },
  monthText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.PURPLE[700],
  },
  activeMonthButton: {
    backgroundColor: COLORS.PURPLE[600],
    borderColor: COLORS.PURPLE[800],
  },
  activeMonthText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  expenseCard: { marginVertical: 8 },
  expenseRow: { flexDirection: "row", justifyContent: "space-between" },
  expenseCategory: { fontSize: 16, fontWeight: "bold" },
  expenseAmount: { fontSize: 16, color: "red" },
  expenseDate: { fontSize: 14, color: "gray" },
  expenseActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    fontSize: 5,
    bottom: 100,
    backgroundColor: "purple",
    width: 56, // Set width
    height: 56, // Set height to the same value
    borderRadius: 28, // Half of width/height for a circle
    justifyContent: "center", // Center the icon inside
    alignItems: "center", // Center the icon inside
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
