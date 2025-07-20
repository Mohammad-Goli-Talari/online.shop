import React, { useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const LoginWithCodeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500)); // simulate sending code
    setSnackbarMessage('Login code sent to your email!');
    setSnackbarOpen(true);
    setLoading(false);
    reset();
    setTimeout(() => {
      navigate('/verify-login');
    }, 1500);
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
              Login with Code
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Enter your email and we’ll send you a login code.
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
            {loading ? 'Sending...' : 'Send Login Code'}
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: '#4caf50',
            color: 'white',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginWithCodeForm;
