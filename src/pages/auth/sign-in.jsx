import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import SigninForm from '../../components/auth/SigninForm';

const SigninPage = () => {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  );
};

export default SigninPage;
