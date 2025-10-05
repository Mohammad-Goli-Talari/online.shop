import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Stack
} from '@mui/material';
import CustomerLayout from '../layouts/CustomerLayout';
import useAuth from '../hooks/useAuth';

const DebugNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const testNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <CustomerLayout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Debug Navigation
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current State
            </Typography>
            <Typography>Current Path: {location.pathname}</Typography>
            <Typography>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Typography>
            <Typography>User: {user ? JSON.stringify(user, null, 2) : 'None'}</Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test Navigation
            </Typography>
            <Stack spacing={2} direction="row" flexWrap="wrap">
              <Button 
                variant="outlined" 
                onClick={() => testNavigation('/')}
              >
                Home
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => testNavigation('/profile')}
              >
                Profile
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => testNavigation('/settings')}
              >
                Settings
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => testNavigation('/auth/sign-in')}
              >
                Sign In
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => testNavigation('/admin')}
              >
                Admin
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </CustomerLayout>
  );
};

export default DebugNavigation;