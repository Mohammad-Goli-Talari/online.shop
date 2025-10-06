import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
  
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Google,
  GitHub,
  Twitter,
  Facebook,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation.js';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const SigninForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (formData) => {
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSnackbarSeverity('success');
        setSnackbarMessage(t('auth.signedInSuccessfully'));
        setSnackbarOpen(true);
        reset();
        
        const from = location.state?.from?.pathname;
        const redirectPath = from || (result.user.role === 'ADMIN' ? '/admin' : '/');
        
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(result.error || t('auth.signInFailed'));
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarSeverity('error');
      setSnackbarMessage(err.message || t('auth.signInFailed'));
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        maxWidth: 460,
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
      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" fontWeight={700}>{t('auth.signIn')}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('auth.dontHaveAccount')}{' '}
            <Link
              to="/auth/sign-up"
              style={{ color: '#2e7d32', fontWeight: 500, textDecoration: 'none' }}
            >
              {t('auth.signUp')}
            </Link>
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        )}

        <TextField
          label={t('auth.email')}
          fullWidth
          size="small"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          fullWidth
          size="small"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label={t('auth.togglePasswordVisibility')}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link
            to="/auth/forgot-password"
            style={{ fontSize: '0.75rem', color: '#2e7d32', textDecoration: 'none' }}
          >
            {t('auth.forgotPassword')}
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="medium"
          disabled={loading}
          sx={{
            textTransform: 'none',
            backgroundColor: '#1a1a1a',
            '&:hover': { backgroundColor: '#333' },
          }}
        >
          {loading ? t('loading.signingIn') : t('auth.signIn')}
        </Button>

        <Divider sx={{ fontSize: '0.65rem', my: 1 }}>{t('auth.or')}</Divider>

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <Google sx={{ color: '#DB4437', fontSize: 20 }} />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <GitHub sx={{ color: '#000000', fontSize: 20 }} />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <Twitter sx={{ color: '#1DA1F2', fontSize: 20 }} />
          </IconButton>
          <IconButton sx={{ border: '1px solid #e0e0e0', bgcolor: '#fff', width: 36, height: 36 }}>
            <Facebook sx={{ color: '#1d32f2ff', fontSize: 20 }} />
          </IconButton>
        </Box>
      </Stack>

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

export default SigninForm;