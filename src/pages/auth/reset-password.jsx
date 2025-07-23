// src/pages/auth/reset-password.jsx
import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
