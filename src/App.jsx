import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordForm from './components/forgot-password/ForgotPasswordForm';
import EmailVerificationForm from './components/EmailVerificationForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<AuthPage><SignInForm /></AuthPage>} />
      <Route path="/signup" element={<AuthPage><SignUpForm /></AuthPage>} />
      <Route path="/forgot-password" element={<AuthPage><ForgotPasswordForm /></AuthPage>} />
      <Route path="/verify-email" element={<AuthPage><EmailVerificationForm /></AuthPage>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
