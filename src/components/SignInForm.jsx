// src/components/SignInForm.jsx
import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, InputAdornment,
  CircularProgress, Divider, Snackbar, Alert, Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  password: yup.string().min(8).required('Password is required.'),
});

function SignInForm({ switchForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, type: '', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Sign in:', data);
      reset(); // پاک‌سازی فرم
      setSnack({ open: true, type: 'success', message: 'Login successful!' });
      setLoading(false);
    }, 1500);
  };

  return (
    <Box width="100%">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Welcome back
      </Typography>

      <Typography variant="body2" mb={2}>
        Don't have an account?{' '}
        <Typography component="span" color="green" onClick={switchForm} sx={{ cursor: 'pointer' }}>
          Sign up
        </Typography>
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email address"
          variant="outlined"
          size="small"
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          size="small"
          type={showPassword ? 'text' : 'password'}
          margin="normal"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message || '8+ characters'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#1e1e1e', color: 'white', mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Stack direction="row" spacing={2} justifyContent="center">
        <IconButton sx={{ border: '1px solid #ccc' }}>
          <GoogleIcon />
        </IconButton>
        <IconButton sx={{ border: '1px solid #ccc' }}>
          <GitHubIcon />
        </IconButton>
        <IconButton sx={{ border: '1px solid #ccc' }}>
          <XIcon />
        </IconButton>
      </Stack>

      {/* Snackbar برای پیام موفقیت یا خطا */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.type} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignInForm;