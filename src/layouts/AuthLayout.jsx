// src/layouts/AuthLayout.jsx
import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: isMobile ? 0 : 320,
          transition: 'all 0.4s ease',
          backgroundColor: isMobile ? 'transparent' : 'lightgray',
          color: '#fff',
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
        }}
      >
        {!isMobile && (
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={800}>
              Hi, Welcome Back To Online Shop
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              To keep connected with us, please login with your personal info
            </Typography>
          </Box>
        )}
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          width: isMobile ? '100%' : 'auto',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
