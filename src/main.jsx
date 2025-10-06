import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Import i18n configuration
import './i18n';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext.jsx';
import { CustomThemeProvider } from './context/ThemeContext.jsx';
import LanguageProvider from './context/LanguageContext.jsx';
import EnhancedThemeProvider from './context/EnhancedThemeProvider.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

import App from './App';
import './index.css';
import './styles/rtl.css';
import { preloadCriticalFallbackImages } from './utils/fallbackImages.js';

preloadCriticalFallbackImages();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <EnhancedThemeProvider>
            <CssBaseline />
            <CustomThemeProvider>
              <AuthProvider>
                <CartProvider>
                  <App />
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#4ade80',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </CartProvider>
              </AuthProvider>
            </CustomThemeProvider>
          </EnhancedThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
