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
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: isMobile ? 0 : 320,
          transition: 'all 0.4s ease',
          backgroundColor: isMobile ? 'none' : 'lightgray',
          color: '#fff',
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: isMobile ? 0 : 3,
        }}
      >
        {!isMobile && (
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={800}>
              Hi, Welcome Back
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
