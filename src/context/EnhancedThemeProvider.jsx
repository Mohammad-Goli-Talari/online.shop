import React, { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLanguage } from '../hooks/useLanguage.js';

import { EnhancedThemeContext } from '../contexts/EnhancedThemeContext.js';

const EnhancedThemeProvider = ({ children }) => {
  const { currentLanguage, getCurrentLocale, isRTL } = useLanguage();

  const theme = useMemo(() => {
    let locale;
    try {
      locale = getCurrentLocale();
    } catch (error) {
      console.warn('Error getting locale in theme, using default:', error);
      locale = { mui: {}, date: {} };
    }
    
    return createTheme({
      direction: isRTL ? 'rtl' : 'ltr',
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
          contrastText: '#fff',
        },
        secondary: {
          main: '#dc004e',
          light: '#ff5983',
          dark: '#9a0036',
          contrastText: '#fff',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
      typography: {
        fontFamily: isRTL 
          ? '"Cairo", "Tajawal", "Arial", "sans-serif"'
          : '"Roboto", "Helvetica", "Arial", "sans-serif"',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
          lineHeight: 1.3,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
          lineHeight: 1.4,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
          lineHeight: 1.4,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 600,
          lineHeight: 1.5,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 600,
          lineHeight: 1.6,
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.5,
        },
        body2: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 8,
      },
      spacing: 8,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600,
              padding: '8px 16px',
            },
            contained: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    }, locale.mui);
  }, [getCurrentLocale, isRTL]);

  const value = {
    theme,
    isRTL,
    currentLanguage,
  };

  let locale;
  try {
    locale = getCurrentLocale();
  } catch (error) {
    console.warn('Error getting locale in render, using default:', error);
    locale = { date: {} };
  }

  return (
    <EnhancedThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider 
          dateAdapter={AdapterDateFns} 
          adapterLocale={locale?.date}
        >
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </EnhancedThemeContext.Provider>
  );
};

export default EnhancedThemeProvider;
