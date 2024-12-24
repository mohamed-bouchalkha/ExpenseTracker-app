import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "./utils/colors2"; // Make sure to import COLORS if you have it.

const HomeScreen = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Food", amount: 50, date: "2024-12-20" },
    { id: 2, category: "Transport", amount: 20, date: "2024-12-19" },
  ]);
  const [month, setMonth] = useState(moment().format("MMMM"));
  const monthsScrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  const [isAddExpenseDisabled, setIsAddExpenseDisabled] = useState(false);
  const [activeFooter, setActiveFooter] = useState("Home"); // Track active footer icon

  const fetchExpensesHandler = async () => {
    console.log("Fetching expenses...");
  };

  const updateMonthHandler = async (selectedMonth: React.SetStateAction<string>) => {
    setMonth(selectedMonth);
    await fetchExpensesHandler();
  };

  const topCategories = [
    { id: 1, name: "Food", total: 250 },
    { id: 2, name: "Transport", total: 150 },
    { id: 3, name: "Utilities", total: 300 },
  ];

  const handleAddExpense = () => {
   /*  setIsAddExpenseDisabled(true); for the disble the addEx */
    setActiveFooter("Add");
    router.push("./AddExpence");
  };

  const handleFooterPress = (label: string, route: string) => {
    setActiveFooter(label);
    if (route === "./Home" || route === "./AddExpence" || route === "./AddCatgory" || route === "./EditBudget") {
      router.push(route);
    }
  };

  interface FooterButtonProps {
    icon: string;
    label: string;
    onPress: () => void;
    active: boolean;
    disabled?: boolean;
  }

  const FooterButton: React.FC<FooterButtonProps> = ({ icon, label, onPress, active, disabled }) => (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
      }}
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
        onPress={() => handleFooterPress("Home", "/index")}
        active={activeFooter === "Home"} disabled={undefined}      />
      <FooterButton
        icon="plus-circle"
        label="Add"
        onPress={handleAddExpense}
        active={activeFooter === "Add"}
        disabled={isAddExpenseDisabled}
      />
      <FooterButton
        icon="account"
        label="Profile"
        onPress={() => handleFooterPress("Profile", "/AddCatgory")}
        active={activeFooter === "Profile"} disabled={undefined}      />
      <FooterButton
        icon="history"
        label="History"
        onPress={() => handleFooterPress("History", "/EditBudget")}
        active={activeFooter === "History"} disabled={undefined}      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          ref={monthsScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsContainer}
        >
          {moment.months().map((item, index) => (
            <TouchableOpacity
              key={index}
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
          ))}
        </ScrollView>
      </View>

      <Card style={styles.summaryCard}>
        <Card.Title
          title={`Total Expenses: $${expenses.reduce(
            (acc, curr) => acc + curr.amount,
            0
          )}`}
          left={(props) => (
            <Avatar.Icon {...props} icon="wallet" style={{ backgroundColor: "#6c5ce7" }} />
          )}
        />
      </Card>

      <Text style={styles.sectionTitle}>Top Spending Categories</Text>
      <FlatList
        data={topCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.categoryCard}>
            <Card.Content>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryTotal}>${item.total}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <Card.Content>
              <View style={styles.expenseRow}>
                <Text style={styles.expenseCategory}>{item.category}</Text>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { marginBottom: 20 },
  monthsContainer: { flexDirection: "row", alignItems: "center" },
  monthButton: { marginHorizontal: 10, padding: 10, borderRadius: 10 },
  monthText: { fontSize: 16, fontWeight: "bold", color: "gray" },
  activeMonthButton: { backgroundColor: COLORS.PURPLE[600] },
  activeMonthText: { color: "white" },
  summaryCard: { marginBottom: 20, backgroundColor: "#f3f4f6" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  categoryCard: { marginHorizontal: 8, padding: 10, borderRadius: 10 },
  categoryName: { fontSize: 16, fontWeight: "bold" },
  categoryTotal: { fontSize: 14, color: "gray" },
  expenseCard: { marginVertical: 8 },
  expenseRow: { flexDirection: "row", justifyContent: "space-between" },
  expenseCategory: { fontSize: 16, fontWeight: "bold" },
  expenseAmount: { fontSize: 16, color: "red" },
  expenseDate: { fontSize: 14, color: "gray" },
  fab: { position: "absolute", right: 16, bottom: 100, backgroundColor: "purple" },
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
});

export default HomeScreen;
