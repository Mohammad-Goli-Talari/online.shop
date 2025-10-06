import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '../hooks/useTranslation.js';

const AuthLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

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
              {t('auth.welcomeBack')}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              {t('auth.keepConnectedMessage')}
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
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
