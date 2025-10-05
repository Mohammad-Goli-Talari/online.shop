import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
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
import useAuth from '../../hooks/useAuth';
import LoginRequiredDialog from '../common/LoginRequiredDialog';
import { checkAuthenticationForAction } from '../../utils/authUtils';

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
  buyNowHandler = null,
  loading = false,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const handleIncrement = useCallback(() => incrementQuantity?.(), [incrementQuantity]);
  const handleDecrement = useCallback(() => decrementQuantity?.(), [decrementQuantity]);
  
  const handleAddToCart = useCallback(() => {
    const authResult = checkAuthenticationForAction(isAuthenticated, 'add_to_cart');
    if (!authResult.success) {
      setShowLoginDialog(true);
      return;
    }
    
    addToCart?.();
  }, [addToCart, isAuthenticated]);
  
  const handleBuyNow = useCallback(() => {
    const authResult = checkAuthenticationForAction(isAuthenticated, 'buy_now');
    if (!authResult.success) {
      setShowLoginDialog(true);
      return;
    }
    
    buyNowHandler?.();
  }, [buyNowHandler, isAuthenticated]);

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth/sign-in', { 
      state: { 
        from: window.location.pathname,
        action: 'add_to_cart' 
      } 
    });
  };

  const handleSignupRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth/sign-up', { 
      state: { 
        from: window.location.pathname,
        action: 'add_to_cart' 
      } 
    });
  };

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
  };

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

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={showLoginDialog}
        onClose={handleCloseLoginDialog}
        onLoginRedirect={handleLoginRedirect}
        onSignupRedirect={handleSignupRedirect}
      />
    </Box>
  );
};

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
