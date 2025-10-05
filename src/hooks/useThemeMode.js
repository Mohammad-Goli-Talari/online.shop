import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextInstance.js';

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};