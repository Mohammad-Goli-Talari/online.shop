/**
 * UserMenu Component
 * Displays user avatar and dropdown menu with logout functionality
 * Handles both authenticated and non-authenticated states
 */

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const UserMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    handleMenuClose();
    
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const getUserInitials = (user) => {
    if (!user) return '';
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = (user) => {
    return user?.fullName || user?.email || 'User';
  };

  if (loading) {
    return (
      <IconButton color="inherit" disabled>
        <CircularProgress size={24} color="inherit" />
      </IconButton>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          color="inherit"
          startIcon={<LoginIcon />}
          onClick={() => navigate('/auth/sign-in')}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Sign In
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<SignupIcon />}
          onClick={() => navigate('/auth/sign-up')}
          sx={{ 
            display: { xs: 'none', sm: 'flex' },
            borderColor: 'currentColor',
            '&:hover': {
              borderColor: 'currentColor',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Sign Up
        </Button>
        {/* Mobile - just show login icon */}
        <Tooltip title="Sign In">
          <IconButton
            color="inherit"
            onClick={() => navigate('/auth/sign-in')}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <>
      <Tooltip title={`${getUserDisplayName(user)} - Click for menu`}>
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText'
            }}
          >
            {getUserInitials(user)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            {getUserDisplayName(user)}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
          {user?.role && (
            <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>
              {user.role}
            </Typography>
          )}
        </Box>

        {/* Menu Items */}
        <MenuItem 
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/account');
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/profile');
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem 
          onClick={(e) => {
            e.preventDefault();
            handleNavigation('/settings');
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        {/* Admin Panel Link (only for admins) */}
        {isAdmin() && (
          <>
            <Divider />
            <MenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/admin');
              }}
            >
              <ListItemIcon>
                <AdminIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>
                <Typography color="primary.main">Admin Panel</Typography>
              </ListItemText>
            </MenuItem>
          </>
        )}

        <Divider />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          disabled={loggingOut}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            },
          }}
        >
          <ListItemIcon>
            {loggingOut ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LogoutIcon fontSize="small" color="inherit" />
            )}
          </ListItemIcon>
          <ListItemText>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;