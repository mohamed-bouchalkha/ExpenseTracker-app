import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRouter } from 'expo-router';
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "./FooterNavigationComp";
import { VStack } from 'native-base';

const data = [
  {
    name: "Grocery",
    icon: "cart",
    amount: 109.18,
    color: "#3366FF",
    percent: "14.61%",
    expenses: 3,
  },
  {
    name: "Fuel",
    icon: "car",
    amount: 100.0,
    color: "#00CC66",
    percent: "13.39%",
    expenses: 1,
  },
  {
    name: "Travel",
    icon: "airplane",
    amount: 200.0,
    color: "#FFCC00",
    percent: "26.77%",
    expenses: 1,
  },
  {
    name: "Bills",
    icon: "document",
    amount: 70.0,
    color: "#00CCCC",
    percent: "9.37%",
    expenses: 1,
  },
  {
    name: "Clothes",
    icon: "shirt",
    amount: 267.89,
    color: "#FF3399",
    percent: "35.86%",
    expenses: 1,
  },
];

const GraphReportScreen = () => {
  const totalAmount = 747.07;
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
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Graph Reports</Text>
      </View>

      {/* ScrollView for body content (pie chart and categories) */}
      <View style={styles.bodyContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.chartContainer}>
            <PieChart
              data={data.map((item) => ({
                name: item.name,
                value: item.amount,
                color: item.color,
                legendFontColor: "#333",
                legendFontSize: 12,
              }))}
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
                color: () => `#000`,
                strokeWidth: 2,
              }}
            />
            <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
          </View>

          {/* Categories List */}
          <FlatList
            data={data}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={24} color="#fff" />
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemSubtitle}>{item.expenses} expenses</Text>
                </View>
                <Text style={styles.itemAmount}>${item.amount.toFixed(2)}</Text>
              </View>
            )}
          />
        </ScrollView>
      </View>

      {/* Footer */}
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
    // Added space for the footer
    marginBottom: 80, 
  },
  scrollContent: {
    paddingBottom: 80,  // Ensure that content doesn't go under the footer
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default GraphReportScreen;
