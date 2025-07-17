import React from 'react';
import AuthPage from './components/AuthPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signin" element={<AuthPage isSignin />} />
        <Route path="/signup" element={<AuthPage />} />
        {/* مسیر غیرمعتبر */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;