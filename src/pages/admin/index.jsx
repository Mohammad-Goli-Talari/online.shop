// src/pages/admin/index.jsx
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import ProductListPage from '../../pages/admin/products';

const AdminHome = () => {
  const isLoggedIn = true; // Login simulation is done here

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight={600}>
        Welcome to the Admin Dashboard
      </Typography>
      <ProductListPage />
    </AdminLayout>
  );
};

export default AdminHome;
