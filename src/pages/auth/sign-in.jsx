import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import SigninForm from '../../components/auth/SigninForm';

const SignInPage = () => {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  );
};

export default SignInPage;
