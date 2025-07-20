import React, { useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object().shape({
  code: yup
    .string()
    .required('Verification code is required')
    .length(6, 'Code must be exactly 6 digits'),
});

const EmailVerificationForm = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [resendTimer, setResendTimer] = useState(60);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Resend countdown timer
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const onSubmit = (data) => {
    setLoading(true);

    setTimeout(() => {
      if (data.code === '123456') {
        setSnackbarMessage('Email verified successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        reset();

        setTimeout(() => {
          window.location.href = '/dashboard'; // ✅ Redirect after success
        }, 1500);
      } else {
        setSnackbarMessage('Incorrect verification code!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
      setLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setResendTimer(60);
    setSnackbarMessage('Verification code resent!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        maxWidth: 460,
        mx: 'auto',
        mt: 4,
        px: 2,
        py: 3,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Verify Your Email
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Enter the 6-digit code sent to your email address.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
              example@email.com
            </Typography>
          </Box>

          <TextField
            label="Verification Code"
            fullWidth
            size="small"
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              textTransform: 'none',
              backgroundColor: '#1a1a1a',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Didn’t receive the code?{' '}
            <Button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              sx={{ textTransform: 'none', fontWeight: 500 }}
              size="small"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
            </Button>
          </Typography>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailVerificationForm;
