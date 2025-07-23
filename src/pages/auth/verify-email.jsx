// src/pages/auth/verify-email.jsx
import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import EmailVerification from '../../components/auth/EmailVerification';

const EmailVerificationPage = () => {
  return (
    <AuthLayout>
      <EmailVerification />
    </AuthLayout>
  );
};

export default EmailVerificationPage;
