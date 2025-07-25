// src/components/auth/EmailVerification.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(!!token);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [resendCooldown, setResendCooldown] = useState(0);

  // Simulate token verification
  useEffect(() => {
    if (token) {
      console.log('🔐 Token from email link:', token);
      setLoading(true);
      setTimeout(() => {
        const isValid = Math.random() > 0.5;
        setStatus(isValid ? 'success' : 'error');
        setLoading(false);
      }, 1500);
    }
  }, [token]);

  // Countdown for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = () => {
    console.log('📨 Simulating resend verification email...');
    setResendCooldown(60);
  };

  return (
    <Box
      sx={{
        maxWidth: 460,
        width: '100%',
        mx: 'auto',
        mt: { xs: 6, md: 8 },
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600}>
        Email Verification
      </Typography>

      {!token && (
        <>
          <Typography variant="body2" sx={{ mt: 2 }}>
            A verification email has been sent to your email address. Please check your inbox.
          </Typography>

          <Button
            variant="contained"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            sx={{
              mt: 4,
              textTransform: 'none',
              backgroundColor: '#1a1a1a',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
          </Button>
        </>
      )}

      {token && loading && (
        <>
          <Typography variant="body2" sx={{ mt: 3 }}>
            Verifying your email...
          </Typography>
          <CircularProgress sx={{ mt: 3 }} />
        </>
      )}

      {token && !loading && status === 'success' && (
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleOutlineIcon />}
          sx={{ mt: 3 }}
        >
          Email verified successfully! You can now sign in to your account.
        </Alert>
      )}

      {token && !loading && status === 'error' && (
        <Alert
          severity="error"
          variant="filled"
          icon={<ErrorOutlineIcon />}
          sx={{ mt: 3 }}
        >
          Verification link is invalid or has expired. Please request a new one.
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification;
