import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/auth/sign-in';
import SignUpPage from './pages/auth/sign-up';
import ForgetPasswordPage from './pages/auth/forgot-password';
import EmailVerificationPage from './pages/auth/verify-email';
import Dashboard from './components/Dashboard';
import LoginWithCodeForm from './components/LoginWithCodeForm';
import ResetPasswordPage from './pages/auth/reset-password';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/login-with-code" element={<AuthLayout><LoginWithCodeForm /></AuthLayout>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
