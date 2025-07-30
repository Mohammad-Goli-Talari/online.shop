// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initializeMockSystem } from './mocks/index.js';

// Initialize mock system before rendering the app
const startApp = async () => {
  // Initialize mock API system
  await initializeMockSystem();
  
  // Render the React app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

startApp();
