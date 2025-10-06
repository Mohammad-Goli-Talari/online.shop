/**
 * AccountNavigation Component
 * Provides sidebar navigation for user account pages
 * Following modern e-commerce patterns with responsive design
 */

import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
  AccountCircle as AccountIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AccountNavigation = ({ 
  open = false, 
  onClose = () => {},
  variant = 'permanent' // 'permanent' | 'temporary'
}) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAdmin } = useAuth();

  const navigationItems = [
    {
      title: 'Overview',
      path: '/account',
      icon: <DashboardIcon />,
      description: 'Account overview'
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: <PersonIcon />,
      description: 'Personal information'
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      description: 'Account preferences'
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: <OrdersIcon />,
      description: 'Order history',
      badge: 'Soon'
    },
    {
      title: 'Wishlist',
      path: '/wishlist',
      icon: <WishlistIcon />,
      description: 'Saved items',
      badge: 'Soon'
    },
    {
      title: 'Addresses',
      path: '/addresses',
      icon: <AddressIcon />,
      description: 'Shipping addresses',
      badge: 'Soon'
    }
  ];

  const NavigationContent = () => (
    <Box sx={{ width: 280, height: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            My Account
          </Typography>
        </Box>
        {isMobile && variant === 'temporary' && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            {user.fullName || user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
          {user.role && (
            <Chip 
              label={user.role} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      )}

      {/* Navigation Items */}
      <List sx={{ pt: 0 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isDisabled = item.badge === 'Soon';
          
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={isDisabled ? 'div' : RouterLink}
                to={isDisabled ? undefined : item.path}
                selected={isActive}
                disabled={isDisabled}
                onClick={isMobile && variant === 'temporary' ? onClose : undefined}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 0,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  },
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'action.hover',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.6
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'bold' : 'normal'
                  }}
                />
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small" 
                    color="warning"
                    variant="outlined"
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Admin Panel Link (if admin) */}
      {isAdmin() && (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/admin"
              onClick={isMobile && variant === 'temporary' ? onClose : undefined}
              sx={{
                py: 1.5,
                px: 3,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Panel"
                secondary="Store management"
                primaryTypographyProps={{
                  fontWeight: 'bold'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}

      {/* Back to Shopping */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItemButton
          component={RouterLink}
          to="/"
          onClick={isMobile && variant === 'temporary' ? onClose : undefined}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }
          }}
        >
          <ListItemText 
            primary="← Back to Shopping"
            primaryTypographyProps={{
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile && variant === 'temporary') {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          }
        }}
      >
        <NavigationContent />
      </Drawer>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: 'fit-content',
        minHeight: '400px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <NavigationContent />
    </Paper>
  );
};

export default AccountNavigation;