// SignInForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { GitHub, Google, Twitter } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const onSubmit = async (_formData) => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1500));

      setSnackbarSeverity('success');
      setSnackbarMessage('Signed in successfully!');
      setSnackbarOpen(true);
      reset();
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMessage('Sign in failed!');
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
      <Stack spacing={2}>
        {/* Title and Link */}
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Sign In
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Don’t have an account?{' '}
            <Link
              to="/signup"
              style={{ color: '#2e7d32', fontWeight: 500, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        {/* Email and Password */}
        <TextField
          label="Email"
          fullWidth
          size="small"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          size="small"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* Forgot Password + Remember Me */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link
            to="/forgot-password"
            style={{ fontSize: '0.75rem', color: '#2e7d32', textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          size="medium"
          sx={{
            textTransform: 'none',
            backgroundColor: '#1a1a1a',
            '&:hover': { backgroundColor: '#333' },
          }}
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <Divider sx={{ fontSize: '0.65rem', my: 1 }}>OR</Divider>

        {/* OAuth Buttons */}
        <Box display="flex" justifyContent="center" gap={2}>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <Google sx={{ color: '#DB4437', fontSize: 20 }} />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <GitHub sx={{ color: '#000000', fontSize: 20 }} />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <Twitter sx={{ color: '#1DA1F2', fontSize: 20 }} />
          </IconButton>
        </Box>
      </Stack>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignInForm;
