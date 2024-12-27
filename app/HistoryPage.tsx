import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, BackHandler } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "./FooterNavigationComp";
import { VStack } from "native-base";
import { useNavigationState } from "@react-navigation/native";

// Sample expense data sorted by category
const data = [
  {
    category: "Grocery",
    icon: "cart",
    color: "#3366FF",
    expenses: [
      { id: "1", name: "Supermarket", amount: 50.25, date: "2024-12-01" },
      { id: "2", name: "Veggies Market", amount: 58.93, date: "2024-12-03" },
      { id: "3", name: "Meat Market", amount: 45.12, date: "2024-12-04" },
      { id: "4", name: "Fruit Market", amount: 30.75, date: "2024-12-07" },      
    ],
  },
  {
    category: "Fuel",
    icon: "car",
    color: "#00CC66",
    expenses: [{ id: "3", name: "Gas Station", amount: 100.0, date: "2024-12-02" },
      { id: "2", name: "Gas Station", amount: 120.0, date: "2024-12-03" },
      { id: "1", name: "Gas Station", amount: 80.0, date: "2024-12-04" },
      { id: "4", name: "Gas Station", amount: 150.0, date: "2024-12-07" },
    ],
  },
  {
    category: "Travel",
    icon: "airplane",
    color: "#FFCC00",
    expenses: [{ id: "4", name: "Flight Tickets", amount: 200.0, date: "2024-12-05" }],
  },
  {
    category: "Bills",
    icon: "document",
    color: "#00CCCC",
    expenses: [{ id: "5", name: "Electricity Bill", amount: 70.0, date: "2024-12-06" }],
  },
  {
    category: "Clothes",
    icon: "shirt",
    color: "#FF3399",
    expenses: [{ id: "6", name: "Clothing Store", amount: 267.89, date: "2024-12-04" }],
  },
];

const HistoryPage = () => {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [activeFooter, setActiveFooter] = useState<string>("History");
  const router = useRouter();
 // Use useNavigationState to track the current route
 const currentRoute = useNavigationState((state) => state.routes[state.index].name);

 useEffect(() => {
   // Update activeFooter based on currentRoute
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
     // Handle back button press if necessary
     // Optionally, add logic to handle confirmation for exit
     return false; // Prevent default back action (optional)
   };

   BackHandler.addEventListener("hardwareBackPress", onBackPress);

   return () => {
     BackHandler.removeEventListener("hardwareBackPress", onBackPress);
   };
 }, [currentRoute]); // Re-run whenever the route changes

  // Toggle category visibility
  const toggleCategoryVisibility = (category: string) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Expense History</Text>
      </View>
      <SectionList
        sections={data.map((category) => ({
          title: category.category,
          color: category.color,
          icon: category.icon,
          data: category.expenses,
        }))}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title, color, icon } }) => (
          <TouchableOpacity onPress={() => toggleCategoryVisibility(title)}>
            <View style={[styles.sectionHeader, { backgroundColor: color }]}>
              <Icon name={icon} size={20} color="#fff" />
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          </TouchableOpacity>
        )}
        renderItem={({ item, index, section }) => {
          const isExpanded = expandedCategories[section.title];
          if (!isExpanded) {
            return null;
          }

          return (
            <View style={styles.timelineItem}>
              {/* Timeline Dot */}
              <View style={styles.iconContainer}>
                <Icon name="cart" size={20} color={section.color} />
                {index < section.data.length - 1 && <View style={styles.verticalLine} />}
              </View>

              {/* Expense Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.expenseTitle}>{item.name}</Text>
                <Text style={styles.expenseDate}>{item.date}</Text>
              </View>

              {/* Expense Amount */}
              <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />
      <VStack>
        {/* Footer */}
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  verticalLine: {
    height: 30,
    width: 2,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  detailsContainer: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  expenseDate: {
    fontSize: 12,
    color: "#666",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default HistoryPage;
