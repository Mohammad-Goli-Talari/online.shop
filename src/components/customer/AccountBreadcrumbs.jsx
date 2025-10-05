/**
 * AccountBreadcrumbs Component
 * Provides navigation breadcrumbs for user account pages
 * Following e-commerce best practices with consistent navigation patterns
 */

import React from 'react';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Box,
} from '@mui/material';
import { 
  Home, 
  ChevronRight, 
  AccountCircle 
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const AccountBreadcrumbs = ({ 
  title,
  showAccountHome = true,
  customPath = null 
}) => {
  const location = useLocation();
  
  const accountPages = {
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/orders': 'Orders',
    '/wishlist': 'Wishlist',
    '/addresses': 'Addresses',
    '/account': 'My Account'
  };

  const currentPageTitle = title || accountPages[location.pathname] || 'Account';
  
  if (customPath) {
    return (
      <Box component="nav" aria-label="breadcrumb" sx={{ mb: { xs: 2, md: 3 } }}>
        <MUIBreadcrumbs
          separator={<ChevronRight fontSize="small" />}
          sx={{ 
            '& .MuiBreadcrumbs-separator': {
              color: 'text.secondary'
            }
          }}
        >
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <Home fontSize="small" sx={{ mr: 0.5 }} />
            Home
          </Link>

          {customPath.map((item, index) => (
            <React.Fragment key={index}>
              {item.link ? (
                <Link
                  component={RouterLink}
                  underline="hover"
                  color="inherit"
                  to={item.link}
                  sx={{
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {item.title}
                </Link>
              ) : (
                <Typography
                  color="text.primary"
                  aria-current="page"
                >
                  {item.title}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </MUIBreadcrumbs>
      </Box>
    );
  }

  return (
    <Box component="nav" aria-label="breadcrumb" sx={{ mb: { xs: 2, md: 3 } }}>
      <MUIBreadcrumbs
        separator={<ChevronRight fontSize="small" />}
        sx={{ 
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary'
          }
        }}
      >
        {/* Home Link */}
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <Home fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>

        {/* Account Section Link (optional) */}
        {showAccountHome && location.pathname !== '/account' && (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to="/account"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <AccountCircle fontSize="small" sx={{ mr: 0.5 }} />
            My Account
          </Link>
        )}

        {/* Current Page */}
        <Typography
          color="text.primary"
          aria-current="page"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500
          }}
        >
          {location.pathname === '/account' && (
            <AccountCircle fontSize="small" sx={{ mr: 0.5 }} />
          )}
          {currentPageTitle}
        </Typography>
      </MUIBreadcrumbs>
    </Box>
  );
};

export default AccountBreadcrumbs;