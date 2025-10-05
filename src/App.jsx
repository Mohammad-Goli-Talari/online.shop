import { Routes, Route, Navigate } from 'react-router-dom';

import SigninPage from './pages/auth/sign-in';
import SignupPage from './pages/auth/sign-up';
import ForgetPasswordPage from './pages/auth/forgot-password';
import ResetPasswordPage from './pages/auth/reset-password';
import EmailVerificationPage from './pages/auth/verify-email';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentCancelled from './pages/PaymentCancelled';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DebugNavigation from './pages/DebugNavigation';

import AdminHome from './pages/admin';
import ProductListPage from './pages/admin/products';
import AdminOrdersPage from './pages/admin/orders';

import { AdminRoute, GuestRoute, AuthenticatedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failure" element={<PaymentFailure />} />
      <Route path="/payment-cancelled" element={<PaymentCancelled />} />
      
      <Route path="/account" element={
        <AuthenticatedRoute>
          <Account />
        </AuthenticatedRoute>
      } />
      <Route path="/profile" element={
        <AuthenticatedRoute>
          <Profile />
        </AuthenticatedRoute>
      } />
      <Route path="/settings" element={
        <AuthenticatedRoute>
          <Settings />
        </AuthenticatedRoute>
      } />
      
      <Route path="/debug" element={<DebugNavigation />} />
      
      <Route path="/auth/sign-in" element={
        <GuestRoute>
          <SigninPage />
        </GuestRoute>
      } />
      <Route path="/auth/sign-up" element={
        <GuestRoute>
          <SignupPage />
        </GuestRoute>
      } />
      <Route path="/auth/forgot-password" element={
        <GuestRoute>
          <ForgetPasswordPage />
        </GuestRoute>
      } />
      <Route path="/auth/reset-password" element={
        <GuestRoute>
          <ResetPasswordPage />
        </GuestRoute>
      } />
      <Route path="/auth/verify-email" element={
        <GuestRoute>
          <EmailVerificationPage />
        </GuestRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <AdminHome />
        </AdminRoute>
      } />
      <Route path="/admin/products" element={
        <AdminRoute>
          <ProductListPage />
        </AdminRoute>
      } />
      <Route path="/admin/orders" element={
        <AdminRoute>
          <AdminOrdersPage />
        </AdminRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
