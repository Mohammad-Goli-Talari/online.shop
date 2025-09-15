// src/components/customer/ProductActions.jsx
import React from 'react';
import { Box, Button, IconButton, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';

const ProductActions = ({ quantity, incrementQuantity, decrementQuantity, addToCart, cartLoading, cartSuccess, stock }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={decrementQuantity}><Remove /></IconButton>
      <Typography>{quantity}</Typography>
      <IconButton onClick={incrementQuantity}><Add /></IconButton>
    </Box>

    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ShoppingCart />}
        onClick={addToCart}
        disabled={cartLoading || stock === 0}
      >
        {cartLoading ? <CircularProgress size={24} color="inherit" /> : 'Add to Cart'}
      </Button>
    </Box>

    <Snackbar open={cartSuccess} autoHideDuration={3000}>
      <Alert severity="success">Added to cart!</Alert>
    </Snackbar>
  </Box>
);

export default ProductActions;
