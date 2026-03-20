import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: "#008080" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "RealEstate AI" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
