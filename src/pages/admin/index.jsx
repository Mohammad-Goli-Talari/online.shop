import React from 'react';
import AdminLayout from './layouts/AdminLayout';
import { Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

const AdminHome = () => {
  const isLoggedIn = true; // Login simulation is done here

  if (!isLoggedIn) {
    return <Navigate to="/auth/signin" />;
  }

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight={600}>
        Welcome to the Admin Dashboard
      </Typography>
    </AdminLayout>
  );
};

export default AdminHome;
