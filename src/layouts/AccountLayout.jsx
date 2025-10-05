/**
 * AccountLayout Component
 * Wraps account pages with consistent navigation and breadcrumbs
 * Provides responsive layout following e-commerce best practices
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from './CustomerLayout';
import AccountBreadcrumbs from '../components/customer/AccountBreadcrumbs';
import AccountNavigation from '../components/customer/AccountNavigation';

const AccountLayout = ({ 
  children, 
  title,
  breadcrumbProps = {},
  showBackButton = true,
  showNavigation = true 
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleMobileNavToggle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <CustomerLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Breadcrumbs */}
        <AccountBreadcrumbs 
          title={title}
          {...breadcrumbProps}
        />

        {/* Mobile Navigation Toggle */}
        {isMobile && showNavigation && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleMobileNavToggle}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            {showBackButton && (
              <Tooltip title="Go back">
                <IconButton
                  onClick={handleBackClick}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <BackIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 0, md: 3 }}>
          {/* Sidebar Navigation (Desktop) */}
          {showNavigation && !isMobile && (
            <Grid 
              size={{ xs: 12, md: 3 }}
              sx={{ 
                display: { xs: 'none', md: 'block' }
              }}
            >
              <AccountNavigation variant="permanent" />
            </Grid>
          )}

          {/* Main Content */}
          <Grid 
            size={{ 
              xs: 12, 
              md: showNavigation ? 9 : 12 
            }}
          >
            <Box sx={{ minHeight: '60vh' }}>
              {children}
            </Box>
          </Grid>
        </Grid>

        {/* Mobile Navigation Drawer */}
        {showNavigation && isMobile && (
          <AccountNavigation
            variant="temporary"
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />
        )}

        {/* Desktop Back Button (Floating) */}
        {!isMobile && showBackButton && (
          <Tooltip title="Go back" placement="left">
            <Fab
              onClick={handleBackClick}
              size="medium"
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: 'primary.main'
                }
              }}
            >
              <BackIcon />
            </Fab>
          </Tooltip>
        )}
      </Container>
    </CustomerLayout>
  );
};

export default AccountLayout;