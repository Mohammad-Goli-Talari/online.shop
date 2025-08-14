// src/layouts/CustomerLayout.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import SearchBar from '../components/customer/SearchBar';

/**
 * CustomerLayout provides the main structure for customer-facing pages.
 * It includes a header with navigation and search, and a footer.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @param {Function} props.onSearch - The function to handle search queries from the SearchBar.
 */
const CustomerLayout = ({ children, onSearch, cartCount }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
        tabIndex={0} aria-label="Skip to main content">
        Skip to main content
      </a>
      <header aria-label="Main header">
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              MyStore
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 2, mx: 2 }}>
              <SearchBar onSearch={onSearch} />
            </Box>
            <IconButton color="inherit" aria-label="shopping cart">
              <Badge badgeContent={cartCount || 0} color="primary" aria-label="cart items">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Toolbar>
          <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1 }}>
            <SearchBar onSearch={onSearch} />
          </Box>
        </AppBar>
      </header>

      <Container component="main" id="main-content" sx={{ flexGrow: 1, py: 4 }} aria-label="Main content">
        {children}
      </Container>

      <footer aria-label="Main footer">
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
              MyStore © {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      </footer>
    </Box>
  );
};

CustomerLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onSearch: PropTypes.func.isRequired,
  cartCount: PropTypes.number,
};

CustomerLayout.defaultProps = {
  cartCount: 0,
};

export default CustomerLayout;