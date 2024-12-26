import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "./utils/colors2";

// Define the Footer component prop types
interface FooterProps {
  activeFooter: string;
  handleFooterPress: (label: string, route: "/MainScreen" | "/AddExpence" | "/ProfileScreen" | "/EditBudget") => void;
}

const Footer: React.FC<FooterProps> = ({ activeFooter, handleFooterPress }) => (
  <View style={styles.footer}>
    <FooterButton
      icon="home"
      label="Home"
      onPress={() => handleFooterPress("Home", "/MainScreen")}
      active={activeFooter === "Home"}
    />
    <FooterButton
      icon="chart-line"
      label="Graph"
      onPress={() => handleFooterPress("Graph", "/AddExpence")}
      active={activeFooter === "Graph"}
    />
    <FooterButton
      icon="history"
      label="History"
      onPress={() => handleFooterPress("History", "/EditBudget")}
      active={activeFooter === "History"}
    />
    <FooterButton
      icon="account"
      label="Profile"
      onPress={() => handleFooterPress("Profile", "/ProfileScreen")}
      active={activeFooter === "Profile"}
    />
  </View>
);

// FooterButton component
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

// Footer Styles
const styles = StyleSheet.create({
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

export default Footer;
