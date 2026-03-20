import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

export const theme = {
  primaryColor: "#008080",
  secondaryColor: "#E0E0E0",
  accentColor: "#FF6B35",
  backgroundColor: "#FFFFFF",
  textColor: "#1A1A2E",
  fontFamily: "Inter",
  fontSize: 16,
  spacing: 8,
  borderRadius: 4,
};

const ThemeContext = createContext({
  isDark: false,
  colors: {
    primary: theme.primaryColor,
    background: theme.backgroundColor,
    text: theme.textColor,
    secondary: theme.secondaryColor,
    accent: theme.accentColor,
  },
  fontFamily: theme.fontFamily,
  fontSize: theme.fontSize,
  spacing: theme.spacing,
  borderRadius: theme.borderRadius,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isDark = useColorScheme() === "dark";

  const value = {
    isDark,
    colors: {
      primary: theme.primaryColor,
      background: isDark ? "#000000" : theme.backgroundColor,
      text: isDark ? "#FFFFFF" : theme.textColor,
      secondary: theme.secondaryColor,
      accent: theme.accentColor,
    },
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
};
