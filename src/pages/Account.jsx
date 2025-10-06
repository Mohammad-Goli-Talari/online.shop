/**
 * Account Overview Page
 * Central hub for user account management
 * Provides quick access to all account sections
 */

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Icon,
  Paper,
  Avatar,
  Chip,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  LocationOn as AddressIcon,
  Edit as EditIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import AccountLayout from '../layouts/AccountLayout';
import useAuth from '../hooks/useAuth';

const Account = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Profile',
      description: 'View and edit your personal information',
      icon: <PersonIcon />,
      path: '/profile',
      color: 'primary',
      available: true
    },
    {
      title: 'Settings',
      description: 'Manage your account preferences',
      icon: <SettingsIcon />,
      path: '/settings',
      color: 'secondary',
      available: true
    },
    {
      title: 'Orders',
      description: 'Track your orders and purchase history',
      icon: <OrdersIcon />,
      path: '/orders',
      color: 'success',
      available: false,
      badge: 'Coming Soon'
    },
    {
      title: 'Wishlist',
      description: 'View your saved and favorite items',
      icon: <WishlistIcon />,
      path: '/wishlist',
      color: 'error',
      available: false,
      badge: 'Coming Soon'
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping addresses',
      icon: <AddressIcon />,
      path: '/addresses',
      color: 'warning',
      available: false,
      badge: 'Coming Soon'
    }
  ];

  return (
    <AccountLayout 
      title="My Account"
      breadcrumbProps={{ showAccountHome: false }}
      showBackButton={true}
    >
      <Box>
        {/* Welcome Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {user?.fullName ? 
                user.fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) :
                user?.email?.charAt(0).toUpperCase() || 'U'
              }
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome back, {user?.fullName || user?.email || 'User'}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage your account, track orders, and update your preferences
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={user?.role || 'Customer'} 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Button
              component={RouterLink}
              to="/profile"
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>

        {/* Account Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wishlist Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saved Addresses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="info.main" fontWeight="bold">
                  ★★★★★
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member Status
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={action.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: action.available ? 1 : 0.6,
                  position: 'relative'
                }}
              >
                <CardActionArea
                  component={action.available ? RouterLink : 'div'}
                  to={action.available ? action.path : undefined}
                  disabled={!action.available}
                  sx={{ 
                    height: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${action.color}.light`,
                        color: `${action.color}.contrastText`,
                        mr: 2
                      }}
                    >
                      <Icon component="div">
                        {action.icon}
                      </Icon>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {action.title}
                      </Typography>
                      {action.badge && (
                        <Chip 
                          label={action.badge} 
                          size="small" 
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    {action.available && (
                      <ArrowIcon sx={{ color: 'text.secondary' }} />
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {action.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Alert */}
        <Alert 
          severity="info" 
          sx={{ mt: 4 }}
        >
          <Typography variant="body2">
            <strong>New features coming soon!</strong> We're working on Orders, Wishlist, and Address management. 
            Stay tuned for updates!
          </Typography>
        </Alert>
      </Box>
    </AccountLayout>
  );
};

export default Account;