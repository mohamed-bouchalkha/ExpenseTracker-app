import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import COLORS from "./utils/colors2";
import API from "./utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// Définir l'interface Expense pour typer correctement les données des dépenses
interface Expense {
  id: string;
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
      console.error("Erreur lors de la récupération des dépenses:", error);
    } finally {
      setLoading(false);
    }
  };

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
      route === "./MainScreen" ||
      route === "./AddExpence" ||
      route === "./ProfileScreen" ||
      route === "./EditBudget"
    ) {
      router.push(route);
    }
  };

  const FooterButton: React.FC<{
    icon: string;
    label: string;
    onPress: () => void;
    active: boolean;
    disabled?: boolean;
  }> = ({ icon, label, onPress, active, disabled }) => (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress}
      style={{ alignItems: "center", justifyContent: "center", padding: 10 }}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={30}
        color={active ? COLORS.YELLOW[400] : "white"}
      />
      <Text
        style={{
          fontSize: 12,
          color: active ? COLORS.YELLOW[400] : "white",
          fontWeight: active ? "bold" : "normal",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Footer = () => (
    <View style={styles.footer}>
      <FooterButton
        icon="home"
        label="Home"
        onPress={() => handleFooterPress("Home", "./MainScreen")}
        active={true}
      />
<FooterButton
  icon="chart-line" // Replaced "plus-circle" with a graph icon
  label="Graph"
  onPress={handleAddExpense} // You can modify this to handle a graph-related action
  active={false}
/>

      <FooterButton
        icon="history"
        label="History"
        onPress={() => handleFooterPress("History", "./EditBudget")}
        active={false}
      />
      <FooterButton
        icon="account"
        label="Profile"
        onPress={() => handleFooterPress("Profile", "./ProfileScreen")}
        active={false}
      />

    </View>
  );
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const userID = await AsyncStorage.getItem("userID");
  
        // If no token or userID is found, navigate to login
        if (!token || !userID) {
          router.replace("/LoginScreen");
        }
      };
  
      checkAuthStatus();
  
      const onBackPress = () => {
        Alert.alert(
          "Quitter l'application",
          "Êtes-vous sûr de vouloir quitter l'application ?",
          [
            { text: "Non", style: "cancel" },
            { text: "Oui", onPress: () => BackHandler.exitApp() },
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
                  title={`Total Expenses: $${totalExpenses || 0}`}
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
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <Card.Content>
              <View style={styles.expenseRow}>
                <Text style={styles.expenseCategory}>
                  {item.categoryID.name}
                </Text>
                <Text style={styles.expenseAmount}>${item.amount}</Text>
              </View>
              <Text style={styles.expenseDate}>
                {moment(item.date).format("DD MMM YYYY")}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddExpense}
        color="#fff"
        label="Add Expense"
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: { marginBottom: 20 },
  monthsContainer: { flexDirection: "row", alignItems: "center" },
  monthButton: { marginHorizontal: 10, padding: 10, borderRadius: 10 },
  monthText: { fontSize: 16, fontWeight: "bold", color: "gray" },
  activeMonthButton: { backgroundColor: COLORS.PURPLE[600] },
  activeMonthText: { color: "white" },
  summaryCard: { marginBottom: 20, backgroundColor: "#f3f4f6" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  expenseCard: { marginVertical: 8 },
  expenseRow: { flexDirection: "row", justifyContent: "space-between" },
  expenseCategory: { fontSize: 16, fontWeight: "bold" },
  expenseAmount: { fontSize: 16, color: "red" },
  expenseDate: { fontSize: 14, color: "gray" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "purple",
  },
  footer: {
    backgroundColor: COLORS.PURPLE[600],
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
