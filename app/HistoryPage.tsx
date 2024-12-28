import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, BackHandler } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "./FooterNavigationComp";
import { useNavigationState } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./utils/api";
import { categories, Category } from "./utils/MyCategory";
import Svg from "./assets/SVG/NoData"; // Ensure this is the correct SVG import

const mapColorToHex = (color: string) => {
  const colorMapping: Record<string, string> = {
    "blue.500": "#3b82f6",
    "green.500": "#10b981",
    "orange.500": "#f97316",
    "yellow.500": "#fbbf24",
    "red.500": "#ef4444",
    "teal.500": "#14b8a6",
    "cyan.500": "#22d3ee",
    "pink.500": "#ec4899",
    "gray.500": "#6b7280",
  };
  return colorMapping[color] || color;
};

const HistoryPage = () => {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [expenses, setExpenses] = useState<{ name: string; detailedExpenses: any[]; categoryID: string | number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFooter, setActiveFooter] = useState("History");
  const router = useRouter();
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    if (currentRoute === "HistoryPage") {
      setActiveFooter("History");
    } else if (currentRoute === "GraphReportScreen") {
      setActiveFooter("Graph");
    } else if (currentRoute === "MainScreen") {
      setActiveFooter("Home");
    } else if (currentRoute === "ProfileScreen") {
      setActiveFooter("Profile");
    }

    const onBackPress = () => {
      return false; // Prevent default back action
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [currentRoute]);

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setError("Token missing");
        return;
      }

      const response = await API.get("/api/expenses/expenses-summary2", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await fetchExpenses();
      if (data) {
        setExpenses(data);
      }
    };

    loadExpenses();
  }, []);

  const toggleCategoryVisibility = (categoryId: string | number) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const handleFooterPress = (label: React.SetStateAction<string>, route: any) => {
    setActiveFooter(label);
    router.push(route);
  };

  const transformedData = expenses.map((expense) => {
    const category = categories.find((cat) => cat._id === expense.categoryID);
    return {
      category: category?.label || "Other",
      icon: category?.icon || "help",
      color: mapColorToHex(category?.color || "gray.500"),
      data: expense.detailedExpenses || [],
      id: expense.categoryID,
      expenseCount: expense.detailedExpenses?.length || 0,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense History</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Svg width={300} height={300} />
        </View>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <SectionList
          sections={transformedData}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderSectionHeader={({ section: { category, color, icon, id, expenseCount } }) => (
            <TouchableOpacity onPress={() => toggleCategoryVisibility(id)}>
              <View style={[styles.sectionHeader, { backgroundColor: color || "#ccc" }]}>
                <Icon name={icon || "help"} size={20} color="#fff" />
                <Text style={styles.sectionHeaderText}>{category || "Unknown Category"}</Text>
                <Text style={styles.expenseCount}>{expenseCount}</Text>
              </View>
            </TouchableOpacity>
          )}
          renderItem={({ item, index, section }) => {
            const isExpanded = expandedCategories[section.id];
            if (!isExpanded) {
              return null;
            }

            return (
              <View style={styles.timelineItem}>
                <View style={styles.iconContainer}>
                  <Icon name="cart" size={20} color={section.color} />
                  {index < section.data.length - 1 && <View style={styles.verticalLine} />}
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.expenseTitle}>{item.name}</Text>
                  <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>

                <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <View style={styles.footerContainer}>
        <Footer activeFooter={activeFooter} handleFooterPress={handleFooterPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", justifyContent: "space-between" },
  header: { backgroundColor: "#6c5ce7", paddingVertical: 20, paddingHorizontal: 15 },
  headerText: { fontSize: 18, color: "#fff", fontWeight: "bold", textAlign: "center" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  sectionHeaderText: { fontSize: 16, color: "#fff", fontWeight: "bold", marginLeft: 10, flex: 1 },
  expenseCount: { fontSize: 16, color: "#fff", fontWeight: "bold", textAlign: "right" },
  timelineItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 15, marginHorizontal: 10, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8, elevation: 1 },
  iconContainer: { alignItems: "center", marginRight: 15 },
  verticalLine: { height: 30, width: 2, backgroundColor: "#ddd", marginVertical: 5 },
  detailsContainer: { flex: 1 },
  expenseTitle: { fontSize: 16, color: "#333", fontWeight: "bold" },
  expenseDate: { fontSize: 12, color: "#666" },
  expenseAmount: { fontSize: 16, fontWeight: "bold", color: "#333" },
  separator: { height: 1, backgroundColor: "#ddd", marginHorizontal: 20 },
  footerContainer: { marginTop: "auto" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HistoryPage;
