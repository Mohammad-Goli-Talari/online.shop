import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, IconButton,
  InputAdornment, CircularProgress, Divider, Stack
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup.string().email().required('Email is required.'),
  password: yup.string().min(8).required('Password is required.'),
});

function SignUpForm({ switchForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Sign up:', data);
      reset(); // پاک‌سازی فرم
      setLoading(false);
    }, 1500);
  };

  return (
    <Box width="100%">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Create your account
      </Typography>

      <Typography variant="body2" mb={2}>
        Already have an account?{' '}
        <Typography component="span" color="green" sx={{ cursor: 'pointer' }} onClick={switchForm}>
          Sign in
        </Typography>
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" gap={1}>
          <TextField
            fullWidth label="First name" variant="outlined" size="small"
            {...register('firstName')} error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            fullWidth label="Last name" variant="outlined" size="small"
            {...register('lastName')} error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Box>

        <TextField
          fullWidth label="Email address" variant="outlined" size="small"
          margin="normal" {...register('email')} error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth label="Password" variant="outlined" size="small"
          type={showPassword ? 'text' : 'password'} margin="normal"
          {...register('password')} error={!!errors.password}
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
          fullWidth type="submit" variant="contained"
          sx={{ backgroundColor: '#1e1e1e', color: 'white', mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
        </Button>
      </form>

      <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
        By signing up, I agree to{' '}
        <Typography component="span" color="primary">Terms of service</Typography>{' '}
        and{' '}
        <Typography component="span" color="primary">Privacy policy</Typography>.
      </Typography>

      <Divider sx={{ my: 2 }}>OR</Divider>

      <Stack direction="row" spacing={2} justifyContent="center">
        <IconButton sx={{ border: '1px solid #ccc' }}><GoogleIcon /></IconButton>
        <IconButton sx={{ border: '1px solid #ccc' }}><GitHubIcon /></IconButton>
        <IconButton sx={{ border: '1px solid #ccc' }}><XIcon /></IconButton>
      </Stack>
    </Box>
  );
}

export default SignUpForm;