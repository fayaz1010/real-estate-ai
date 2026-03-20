import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../theme";

const HomeScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Home Screen</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Welcome to RealEstate AI Mobile!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default HomeScreen;
