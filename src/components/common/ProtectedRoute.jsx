import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireAuth = true,
  fallbackPath = '/auth/sign-in'
}) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  if (requiredRole && (!user || !hasRole(requiredRole))) {
    const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/';
    
    return (
      <Navigate 
        to={redirectPath} 
        state={{ 
          from: location, 
          error: 'You do not have permission to access this page' 
        }} 
        replace 
      />
    );
  }

  if (!requireAuth && isAuthenticated) {
    const redirectPath = user?.role === 'ADMIN' ? '/admin' : '/';
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="ADMIN" fallbackPath="/auth/sign-in">
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRole="USER" fallbackPath="/auth/sign-in">
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute requireAuth={true} fallbackPath="/auth/sign-in">
    {children}
  </ProtectedRoute>
);

export const GuestRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;