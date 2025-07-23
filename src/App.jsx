// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import SigninPage from './pages/auth/sign-in';
import SignupPage from './pages/auth/sign-up';
import ForgetPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';
import EmailVerificationPage from './pages/auth/verify-email';
import Dashboard from './components/Dashboard';
import LoginWithCodeForm from './components/LoginWithCodeForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" />} />
      <Route path="/auth/sign-in" element={<SigninPage />} />
      <Route path="/auth/sign-up" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
      <Route path="/auth/login-with-code" element={<AuthLayout><LoginWithCodeForm /></AuthLayout>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
