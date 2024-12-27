import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import Footer from "./FooterNavigationComp";
import { VStack } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./utils/api";
import { categories} from './utils/MyCategory';

interface Expense {
  categoryID?: { name: string };
  amount: number;
}

export const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // Récupère le token stocké
  
      const response = await API.get("/api/expenses/expenseschart", {
        headers: {
          Authorization: `Bearer ${token}`, // En-tête d'authentification
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
      throw error;
    }
  };

const GraphReportScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFooter, setActiveFooter] = useState<string>("Graph");
  const router = useRouter();

  const handleFooterPress = (label: string, route: string) => {
    setActiveFooter(label);
    if (
      route === "/MainScreen" ||
      route === "/GraphReportScreen" ||
      route === "/ProfileScreen" ||
      route === "/EditBudget"
    ) {
      router.push(route);
    }
  };
  

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
  
  const getColorForCategory = (category: string) => {
    const foundCategory = categories.find((cat) => cat.label === category);
    const colorKey = foundCategory ? foundCategory.color : "gray.500";
    return colorMap[colorKey] || "#A0AEC0"; // Par défaut, retourne le gris hexadécimal
  };
  // const getColorForCategory = (category: string) => {
  //   const hash = category
  //     .split("")
  //     .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[(hash + i) % 16];
  //   }
  //   return color;
  // };

  

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (err) {
        console.error("Erreur lors du chargement des dépenses:", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);

  const chartData = expenses.map((expense) => ({
    name: expense.categoryID?.name || "Autre",
    value: expense.amount,
    color: getColorForCategory(expense.categoryID?.name || "Autre"),
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Graph Reports</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.chartContainer}>
          {loading ? (
            <Text>Chargement...</Text>
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
              <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
            </>
          )}
        </View>
      </View>

      <VStack>
        <Footer activeFooter={activeFooter} handleFooterPress={handleFooterPress} />
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
});

export default GraphReportScreen;
