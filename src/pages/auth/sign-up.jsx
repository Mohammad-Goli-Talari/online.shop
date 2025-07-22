import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
