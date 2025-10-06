import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgetPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgetPasswordPage;
