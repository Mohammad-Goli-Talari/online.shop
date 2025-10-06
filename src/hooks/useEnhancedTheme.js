import { useContext } from 'react';
import { EnhancedThemeContext } from '../contexts/EnhancedThemeContext.js';

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};
