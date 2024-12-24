import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios"; // Assurez-vous que axios est importé
import COLORS from "./utils/colors2"; // Assurez-vous que COLORS est importé
import API from "./utils/api"; // Assurez-vous que le chemin est correct

// Définir l'interface Expense pour typer correctement les données des dépenses
interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string; // Utilisez "Date" si vous voulez utiliser des objets Date au lieu de chaînes
}

const HomeScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]); // Spécifier le type Expense[]
  const [totalExpenses, setTotalExpenses] = useState<number>(0); // Ajouter l'état pour le total des dépenses
  const [month, setMonth] = useState<string>(""); // Initialement vide, pas de mois sélectionné
  const [activeFooter, setActiveFooter] = useState<string>("Home");
  const [loading, setLoading] = useState<boolean>(true); // Ajouter l'état de chargement
  const monthsScrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  // Fonction de récupération des dépenses
  const fetchExpensesHandler = async (selectedMonth: string = "") => {
    try {
      setLoading(true);  // Début du chargement
      const response = await API.get("api/expenses/getAllExpenses", {
        params: { month: selectedMonth } // Si mois est vide, récupérer toutes les dépenses
      });
      const expensesData: Expense[] = response.data.expenses;
      const total = response.data.totalAmount;

      console.log("Fetched Expenses:", expensesData); // Check the fetched expenses data
      console.log("Total Expenses:", total); // Check the total expenses value

      setExpenses(expensesData);
      setTotalExpenses(total);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
    } finally {
      setLoading(false);  // Fin du chargement
    }
  };

  // Mettre à jour le mois et recharger les dépenses
  const updateMonthHandler = async (selectedMonth: string) => {
    setMonth(selectedMonth);
    await fetchExpensesHandler(selectedMonth);  // Recharger les dépenses après avoir changé le mois
  };

  // Gérer l'ajout d'une dépense
  const handleAddExpense = () => {
    router.push("./AddExpence");
  };

  // Gérer la navigation du pied de page
  const handleFooterPress = (label: string, route: string) => {
    setActiveFooter(label);
    if (route === "./Home" || route === "./AddExpence" || route === "./AddCatgory" || route === "./EditBudget") {
      router.push(route);
    }
  };

  const FooterButton: React.FC<{ icon: string; label: string; onPress: () => void; active: boolean; disabled?: boolean }> = ({
    icon,
    label,
    onPress,
    active,
    disabled
  }) => (
    <TouchableOpacity onPress={disabled ? () => {} : onPress} style={{ alignItems: "center", justifyContent: "center", padding: 10 }}>
      <MaterialCommunityIcons name={icon as any} size={30} color={active ? COLORS.YELLOW[400] : "white"} />
      <Text style={{ fontSize: 12, color: active ? COLORS.YELLOW[400] : "white", fontWeight: active ? "bold" : "normal" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Footer = () => (
    <View style={styles.footer}>
      <FooterButton icon="home" label="Home" onPress={() => handleFooterPress("Home", "./Home")} active={true} />
      <FooterButton icon="plus-circle" label="Add" onPress={handleAddExpense} active={false} />
      <FooterButton icon="account" label="Profile" onPress={() => handleFooterPress("Profile", "./AddCatgory")} active={false} />
      <FooterButton icon="history" label="History" onPress={() => handleFooterPress("History", "./EditBudget")} active={false} />
    </View>
  );

  useEffect(() => {
    fetchExpensesHandler();  // Récupérer toutes les dépenses sans filtrer par mois au premier chargement
    setMonth("Décembre"); // Définit "Décembre" comme mois par défaut après le premier chargement
  }, []);

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
            <TouchableOpacity key={index} onPress={() => updateMonthHandler(item)} style={[styles.monthButton, month === item && styles.activeMonthButton]}>
              <Text style={[styles.monthText, month === item && styles.activeMonthText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <Text>Loading...</Text>  // Affiche un message de chargement pendant la récupération des données
      ) : (
        <>
          <Card.Title
            title={`Total Expenses: $${totalExpenses || 0}`}  // Fallback à 0 si totalExpenses est undefined
            left={(props) => <Avatar.Icon {...props} icon="wallet" style={{ backgroundColor: "#6c5ce7" }} />}
          />

          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <FlatList
            data={expenses}
            keyExtractor={(item, index) => `${item.id}-${index}`}  // Concaténer id et index pour garantir l'unicité
            renderItem={({ item }) => (
              <Card style={styles.expenseCard}>
                <Card.Content>
                  <View style={styles.expenseRow}>
                    <Text style={styles.expenseCategory}>{item.category}</Text>
                    <Text style={styles.expenseAmount}>${item.amount}</Text>
                  </View>
                  <Text style={styles.expenseDate}>{moment(item.date).format("DD MMM YYYY")}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </>
      )}

      <FAB icon="plus" style={styles.fab} onPress={handleAddExpense} color="#fff" label="Add Expense" />
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
