// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import SigninPage from './pages/auth/sign-in';
import SignupPage from './pages/auth/sign-up';
import ForgetPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';
import EmailVerificationPage from './pages/auth/verify-email';
import AdminHome from './pages/admin';
import ProductListPage from './pages/admin/products';
import MockDemo from './pages/MockDemo';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mock-demo" element={<MockDemo />} />
      <Route path="/auth/sign-in" element={<SigninPage />} />
      <Route path="/auth/sign-up" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

export default App;
