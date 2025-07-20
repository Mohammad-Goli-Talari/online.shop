import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500)); // Simulate API
      setSnackbarMessage('Reset link sent to your email!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Something went wrong!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
              Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Enter your email and we’ll send you a reset link.
            </Typography>
          </Box>

          <TextField
            label="Email"
            fullWidth
            size="small"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Typography variant="body2" textAlign="center">
            Back to{' '}
            <Link to="/signin" style={{ color: '#2e7d32', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </Typography>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ bottom: 24, left: 24 }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            bgcolor:
              {snackbarSeverity},
            color:
              {snackbarSeverity},
            fontSize: '0.85rem',
            px: 2,
            boxShadow: 1,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordForm;
