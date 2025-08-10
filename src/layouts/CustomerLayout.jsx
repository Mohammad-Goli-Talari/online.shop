import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import SearchBar from '../components/customer/SearchBar';

/**
 * CustomerLayout provides the main structure for customer-facing pages.
 * It includes a header with navigation and search, and a footer.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @param {Function} props.onSearch - The function to handle search queries from the SearchBar.
 */
const CustomerLayout = ({ children, onSearch }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MyStore
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 2, mx: 2 }}>
            <SearchBar onSearch={onSearch} />
          </Box>
          <IconButton color="inherit" aria-label="shopping cart">
            <ShoppingCart />
          </IconButton>
        </Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1 }}>
           <SearchBar onSearch={onSearch} />
        </Box>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
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
    </Box>
  );
};

export default CustomerLayout;