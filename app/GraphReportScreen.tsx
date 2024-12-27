import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import Footer from "./FooterNavigationComp";
import { VStack } from "native-base";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./utils/api";
import { categories} from './utils/MyCategory';

// const data2 = [
//   {
//     name: "Grocery",
//     icon: "cart",
//     amount: 109.18,
//     color: "#3366FF",
//     percent: "14.61%",
//     expenses: 3,
//   },
//   {
//     name: "Fuel",
//     icon: "car",
//     amount: 100.0,
//     color: "#00CC66",
//     percent: "13.39%",
//     expenses: 1,
//   },
//   {
//     name: "Travel",
//     icon: "airplane",
//     amount: 200.0,
//     color: "#FFCC00",
//     percent: "26.77%",
//     expenses: 1,
//   },
//   {
//     name: "Bills",
//     icon: "document",
//     amount: 70.0,
//     color: "#00CCCC",
//     percent: "9.37%",
//     expenses: 1,
//   },
//   {
//     name: "Clothes",
//     icon: "shirt",
//     amount: 267.89,
//     color: "#FF3399",
//     percent: "35.86%",
//     expenses: 1,
//   },
// ];
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

   const fetchExpenses = async () => {
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
  const fetchExpensesSummary = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // Récupère le token JWT de l'utilisateur
      if (!token) {
        console.log('Token manquant');
        return;
      }
  
      const response = await API.get("/api/expenses/expenses-summary", {
        headers: {
          Authorization: `Bearer ${token}`, // Envoi du token pour authentifier l'utilisateur
        },
      });
  
      setExpensesSummary(response.data); // Met à jour le résumé des dépenses dans l'état
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };
  


  const transformedData = expensesSummary.map((expense: any) => {
    // Rechercher la catégorie correspondante
    const matchedCategory = categories.find(
      (cat) => cat._id === expense.categoryID
    ) || categories.find((cat) => cat.label === 'Autre'); // Catégorie par défaut
  
    // Retourner un nouvel objet enrichi
    return {
      name: expense.name, // Conserve le nom depuis le backend
      categoryID: expense.categoryID, // ID de catégorie
      amount: expense.amount, // Montant
      expenses: expense.expenses, // Détails des dépenses
      icon: matchedCategory?.icon || 'help', // Icône de la catégorie ou par défaut
      color: matchedCategory?.color || 'gray.500', // Couleur de la catégorie ou par défaut
    };
  });
  
  console.log(transformedData);
  
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

          {/* Categories List */}
          <FlatList
          data={transformedData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Icon name={item.icon} size={24} color="#fff" />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.expenses} dépenses</Text>
              </View>
              <Text style={styles.itemAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />




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
