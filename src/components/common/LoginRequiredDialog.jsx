import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginRequiredDialog = ({
  open,
  onClose,
  title = 'Login Required',
  message = 'You need to be logged in to continue. Please sign in to your account or create a new one.',
  benefits = [
    'Secure account management',
    'Order history and tracking',
    'Faster checkout process',
    'Personalized recommendations'
  ],
  redirectPath = null // If provided, redirect here after login instead of just closing
}) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    const loginPath = redirectPath 
      ? `/auth/sign-in?redirect=${encodeURIComponent(redirectPath)}`
      : '/auth/sign-in';
    navigate(loginPath);
  };

  const handleSignupRedirect = () => {
    onClose();
    const signupPath = redirectPath 
      ? `/auth/sign-up?redirect=${encodeURIComponent(redirectPath)}`
      : '/auth/sign-up';
    navigate(signupPath);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="login-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          <LoginIcon color="primary" />
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="login-dialog-description" sx={{ mb: 2 }}>
          {message}
        </DialogContentText>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box>
            <strong>Benefits of having an account:</strong>
            <List dense>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSignupRedirect} 
          variant="outlined" 
          startIcon={<SignupIcon />}
          sx={{ mr: 1 }}
        >
          Create Account
        </Button>
        <Button 
          onClick={handleLoginRedirect} 
          variant="contained" 
          startIcon={<LoginIcon />}
          autoFocus
        >
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LoginRequiredDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  benefits: PropTypes.arrayOf(PropTypes.string),
  redirectPath: PropTypes.string,
};

export default LoginRequiredDialog;