// src/components/customer/ProductActions.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  IconButton, 
  Typography, 
  Stack, 
  CircularProgress, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';

const ProductActions = ({
  quantity,
  incrementQuantity,
  decrementQuantity,
  addToCart,
  cartLoading = false,
  cartSuccess = false,
  stock = 0,
  snackbarMessage = '',
  snackbarSeverity = 'success',
  onCloseSnackbar = () => {},
  buyNowHandler = null, // optional future feature
  loading = false, // skeleton loader when product data not yet available
}) => {
  // Callbacks to avoid unnecessary re-renders
  const handleIncrement = useCallback(() => {
    incrementQuantity && incrementQuantity();
  }, [incrementQuantity]);

  const handleDecrement = useCallback(() => {
    decrementQuantity && decrementQuantity();
  }, [decrementQuantity]);

  const handleAddToCart = useCallback(() => {
    addToCart && addToCart();
  }, [addToCart]);

  const handleBuyNow = useCallback(() => {
    buyNowHandler && buyNowHandler();
  }, [buyNowHandler]);

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ height: 56, width: '100%', bgcolor: '#f0f0f0', borderRadius: 1 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mt={3}>
        {/* Quantity Selector */}
        <Box 
          display="flex" 
          alignItems="center" 
          border="1px solid #ccc" 
          borderRadius={1} 
          aria-label="Quantity selector"
        >
          <IconButton 
            onClick={handleDecrement} 
            disabled={quantity <= 1} 
            aria-label="Decrease quantity"
          >
            <Remove />
          </IconButton>
          <Typography sx={{ px: 2, minWidth: '2ch', textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton 
            onClick={handleIncrement} 
            disabled={quantity >= stock} 
            aria-label="Increase quantity"
          >
            <Add />
          </IconButton>
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={cartLoading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
          onClick={handleAddToCart}
          disabled={cartLoading || stock === 0}
          fullWidth
          sx={{
            flexGrow: 1,
            width: { xs: '100%', sm: 'auto' },
            position: { xs: 'sticky', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            zIndex: { xs: 1000, sm: 'auto' },
          }}
          aria-label="Add to cart"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </Button>

        {/* Optional Buy Now button */}
        {buyNowHandler && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBuyNow}
            disabled={cartLoading || stock === 0}
            fullWidth
            sx={{
              width: { xs: '100%', sm: 'auto' },
            }}
            aria-label="Buy now"
          >
            Buy Now
          </Button>
        )}
      </Stack>

      {/* Snackbar for success/error */}
      <Snackbar
        open={cartSuccess || !!snackbarMessage}
        autoHideDuration={3000}
        onClose={onCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        aria-label="Add to cart feedback"
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage || 'Added to cart!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// PropTypes for type safety
ProductActions.propTypes = {
  quantity: PropTypes.number.isRequired,
  incrementQuantity: PropTypes.func.isRequired,
  decrementQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  cartLoading: PropTypes.bool,
  cartSuccess: PropTypes.bool,
  stock: PropTypes.number,
  snackbarMessage: PropTypes.string,
  snackbarSeverity: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  onCloseSnackbar: PropTypes.func,
  buyNowHandler: PropTypes.func,
  loading: PropTypes.bool,
};

export default ProductActions;
