import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext({
  isDark: false,
  colors: {
    primary: '#008080',
    background: '#FFFFFF',
    text: '#1A1A2E',
    secondary: '#E0E0E0',
    accent: '#FF6B35',
  },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isDark = useColorScheme() === 'dark';

  const colors = {
    primary: '#008080',
    background: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A2E',
    secondary: '#E0E0E0',
    accent: '#FF6B35',
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
