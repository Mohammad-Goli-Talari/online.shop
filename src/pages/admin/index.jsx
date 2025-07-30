// src/pages/admin/index.jsx
import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const isLoggedIn = true; // Login simulation is done here
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4}>
          Welcome to the Admin Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Products Management
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage your product inventory, add new products, and update existing ones.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/admin/products')}
                >
                  View Products
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Orders
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Track and manage customer orders.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/admin/orders')}
                >
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Customers
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage customer accounts and information.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/admin/customers')}
                >
                  View Customers
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminHome;
