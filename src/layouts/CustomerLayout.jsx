import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Storefront } from '@mui/icons-material';
import SearchBar from '../components/customer/SearchBar';
import ThemeToggle from '../components/common/ThemeToggle.jsx';
import UserMenu from '../components/common/UserMenu.jsx';
import LanguageSelector from '../components/common/LanguageSelector.jsx';
import { useTranslation } from '../hooks/useTranslation.js';

/**
 * CustomerLayout provides the main structure for customer-facing pages.
 * It includes a header with navigation and search, and a footer.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @param {Function} props.onSearch - The function to handle search queries from the SearchBar.
 */
const CustomerLayout = ({ children, onSearch = () => {}, cartCount = 0, renderCartIcon = null }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
        tabIndex={0} aria-label={t('ui.skipToMainContent')}>
        {t('ui.skipToMainContent')}
      </a>
      <header aria-label={t('ui.mainHeader')}>
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Storefront 
                sx={{ 
                  mr: 1, 
                  fontSize: '2rem',
                  color: 'primary.main',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px'
                }}
              >
                {t('messages.welcome', { defaultValue: 'Goli Store' })}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 2, mx: 2 }}>
              <SearchBar onSearch={onSearch} />
            </Box>
            {renderCartIcon ? renderCartIcon : (
              <IconButton color="inherit" aria-label={t('navigation.cart', { defaultValue: 'shopping cart' })}>
                <Badge badgeContent={cartCount || 0} color="primary" aria-label={t('cart.items', { defaultValue: 'cart items' })}>
                  <ShoppingCart />
                </Badge>
              </IconButton>
            )}
            <LanguageSelector variant="minimal" />
            <ThemeToggle />
            <UserMenu />
          </Toolbar>
          <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1 }}>
            <SearchBar onSearch={onSearch} />
          </Box>
        </AppBar>
      </header>

      <Container component="main" id="main-content" sx={{ flexGrow: 1, py: 4 }} aria-label={t('ui.mainContent')}>
        {children}
      </Container>

      <footer aria-label={t('ui.mainFooter')}>
        <Box
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1" align="center">
              Goli Store © {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      </footer>
    </Box>
  );
};


CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onSearch: PropTypes.func,
  cartCount: PropTypes.number,
  renderCartIcon: PropTypes.node,
};

export default CustomerLayout;