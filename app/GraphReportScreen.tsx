import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  BackHandler,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import Footer from "./FooterNavigationComp";
import { VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons"; // Updated for Expo compatibility
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./utils/api";
import { categories } from "./utils/MyCategory";
import { useNavigationState } from "@react-navigation/native";

interface Expense {
  categoryID?: { name: string };
  amount: number;
}

const GraphReportScreen = () => {
  const [expensesSummary, setExpensesSummary] = useState([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFooter, setActiveFooter] = useState<string>("Graph");
  const router = useRouter();

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    if (currentRoute === "GraphReportScreen") {
      setActiveFooter("Graph");
    } else if (currentRoute === "HistoryPage") {
      setActiveFooter("History");
    } else if (currentRoute === "MainScreen") {
      setActiveFooter("Home");
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

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await API.get("/api/expenses/expenseschart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
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

  const getColorForCategory = (category: string) => {
    const foundCategory = categories.find((cat) => cat.label === category);
    const colorKey = foundCategory ? foundCategory.color : "gray.500";
    const colorMap: { [key: string]: string } = {
      "blue.500": "#3182CE",
      "green.500": "#38A169",
      "orange.500": "#ED8936",
      "yellow.500": "#ECC94B",
      "red.500": "#E53E3E",
      "teal.500": "#319795",
      "cyan.500": "#00B5D8",
      "pink.500": "#D53F8C",
      "gray.500": "#A0AEC0",
    };
    return colorMap[colorKey] || "#A0AEC0";
  };

  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Error loading expenses:", err);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = expenses.map((expense) => ({
    name: expense.categoryID?.name || "Other",
    value: expense.amount,
    color: getColorForCategory(expense.categoryID?.name || "Other"),
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const fetchExpensesSummary = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.log("Token missing");
        return;
      }

      const response = await API.get("/api/expenses/expenses-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpensesSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  const transformedData = expensesSummary.map((expense: any) => {
    const matchedCategory =
      categories.find((cat) => cat._id === expense.categoryID) ||
      categories.find((cat) => cat.label === "Autre");

    return {
      name: expense.name,
      categoryID: expense.categoryID,
      amount: expense.amount,
      expenses: expense.expenses,
      icon: matchedCategory?.icon || "help",
      color: matchedCategory?.color || "gray.500",
    };
  });

  useEffect(() => {
    fetchExpensesSummary();
    loadExpenses();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Graph Reports</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.chartContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>{error}</Text>
          ) : (
            <>
              <PieChart
                data={chartData}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]}
                absolute={false}
                width={Dimensions.get("window").width}
                height={200}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: () => "#000",
                  strokeWidth: 2,
                }}
              />
              <Text style={styles.totalText}>
                Total: ${totalAmount.toFixed(2)}
              </Text>
            </>
          )}
        </View>
        <FlatList
          data={transformedData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getColorForCategory(item.name) },
                ]}
              >
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>

              {/* Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.itemTitle}>{item.name || "No Name"}</Text>
                <Text style={styles.itemSubtitle}>
                  {item.expenses} expenses
                </Text>
              </View>

              {/* Amount */}
              <Text style={styles.itemAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>

      <VStack>
        <Footer
          activeFooter={activeFooter}
          handleFooterPress={handleFooterPress}
        />
      </VStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  bodyContainer: {
    flex: 1,
    marginBottom: 80,
  },
  chartContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  totalText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GraphReportScreen;
