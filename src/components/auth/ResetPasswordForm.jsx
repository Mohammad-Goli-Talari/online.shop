// src/components/auth/ResetPasswordForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Minimum 8 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');
  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    try {
      console.log('Reset token:', token);
      console.log('New Password:', data.password);

      setSnackbar({
        open: true,
        message: 'Password has been reset successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 2000);
    } catch (e) {
      console.error('ResetPassword error', e);
      setSnackbar({
        open: true,
        message: 'Something went wrong!',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        width: '100%',
        minWidth: 320,
        mx: 'auto',
        mt: 4,
        px: { xs: 2, sm: 3 },
        py: 3,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Reset Password
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Enter your new password below
            </Typography>
          </Box>

          <TextField
            label="New Password"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            size="small"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LinearProgress
            variant="determinate"
            value={(passwordStrength / 4) * 100}
            sx={{
              height: 6,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor:
                  passwordStrength < 2 ? 'error.main' :
                  passwordStrength < 3 ? 'warning.main' :
                  'success.main',
              },
            }}
          />

          <TextField
            label="Confirm Password"
            fullWidth
            type={showConfirm ? 'text' : 'password'}
            size="small"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((prev) => !prev)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="caption" color="text.secondary">
            Minimum 8 characters, must include numbers and letters
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isValid}
            sx={{
              textTransform: 'none',
              backgroundColor: '#1a1a1a',
              '&:hover': { backgroundColor: '#333' },
              height: 40,
            }}
          >
            Reset Password
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ bottom: 24, left: 24 }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            width: '100%',
            fontSize: '0.85rem',
            px: 2,
            boxShadow: 1,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordForm;