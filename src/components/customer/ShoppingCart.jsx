import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../../hooks/useTranslation.js';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import LoginRequiredDialog from '../common/LoginRequiredDialog';
import { getProductImage } from '../../utils/fallbackImages.js';
import CheckoutService from '../../services/checkoutService';
import PaymentService from '../../services/paymentService';
import useAuth from '../../hooks/useAuth';
import { AUTH_MESSAGES } from '../../utils/authUtils';

function ShoppingCart({ cartItems, removeFromCart, updateQuantity, clearCart }) {
  const { t } = useTranslation();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getName = (item) => item?.product?.name || item?.name || 'Unknown';
  const getPrice = (item) => item?.product?.price || item?.price || 0;
  const getQuantity = (item) => item?.quantity || 1;
  const getImage = (item) => {
    const originalImage = item?.product?.images?.[0] || item?.product?.image || item?.image;
    const category = item?.product?.category || item?.category;
    const productId = item?.product?.id || item?.productId || item?.id;
    return getProductImage(originalImage, category, productId, 48, 48);
  };

  const handleImageError = (e, item) => {
    const itemId = item?.id || item?.productId;
    if (itemId && !imageErrors.has(itemId)) {
      setImageErrors(prev => new Set([...prev, itemId]));
      const category = item?.product?.category || item?.category;
      const productId = item?.product?.id || item?.productId || item?.id;
      const fallbackUrl = getProductImage(null, category, productId, 48, 48);
      e.target.src = fallbackUrl;
    }
  };

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + getPrice(item) * getQuantity(item), 0)
    : 0;

  const handleIncrement = async (item) => {
    if (!item?.id) return;
    const currentQty = getQuantity(item);
    await updateQuantity(item.id, currentQty + 1);
  };

  const handleDecrement = async (item) => {
    if (!item?.id) return;
    const currentQty = getQuantity(item);
    await updateQuantity(item.id, currentQty - 1);
  };

  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      toast.error(AUTH_MESSAGES.CHECKOUT_LOGIN_REQUIRED);
      return;
    }

    setProcessingPayment(true);
    setPaymentError(null);

    try {
      const validation = CheckoutService.validateCheckout(cartItems);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const checkoutResult = await CheckoutService.processCheckout(cartItems);
      
      if (checkoutResult.success && checkoutResult.payment.redirectUrl) {
        toast.success('Redirecting to secure payment gateway...');
        
        setTimeout(() => {
          PaymentService.redirectToGateway(checkoutResult.payment.redirectUrl);
        }, 1000);
      } else {
        throw new Error('Failed to initiate payment process');
      }

    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentError(error.message);
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleLoginRedirect = () => {
    setLoginDialogOpen(false);
    navigate('/auth/sign-in');
  };

  const handleSignupRedirect = () => {
    setLoginDialogOpen(false);
    navigate('/auth/sign-up');
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2, minWidth: 320 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{t('cart.title')}</Typography>
        {cartItems.length > 0 && (
          <Button variant="outlined" color="secondary" size="small" onClick={clearCart}>
            {t('ui.clearCart')}
          </Button>
        )}
      </Box>

      {cartItems.length === 0 ? (
        <EmptyState 
          icon={CartIcon}
          title={t('ui.yourCartIsEmpty')}
          description={t('ui.addProductsToCart')}
          variant="compact"
        />
      ) : (
        <>
          <List>
            {cartItems.map((item, idx) => (
              <ListItem key={item.id || idx} divider alignItems="flex-start">
                <img
                  src={getImage(item)}
                  alt={getName(item)}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 12 }}
                  onError={(e) => handleImageError(e, item)}
                  loading="lazy"
                />

                <ListItemText
                  primary={getName(item)}
                  secondary={
                    <Typography component="span" variant="body2" color="text.primary">
                      ${getPrice(item)} each
                    </Typography>
                  }
                />

                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDecrement(item)}
                    disabled={!item?.id}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography sx={{ mx: 1 }}>{getQuantity(item)}</Typography>

                  <IconButton
                    size="small"
                    onClick={() => handleIncrement(item)}
                    disabled={!item?.id}
                  >
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => item?.id && removeFromCart(item.id)}
                    sx={{ ml: 1 }}
                    disabled={!item?.id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
            <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handlePayment}
            disabled={processingPayment || cartItems.length === 0}
            startIcon={processingPayment ? <CircularProgress size={20} /> : <PaymentIcon />}
          >
            {processingPayment ? t('loading.processing') : t('cart.checkout')}
          </Button>

          {paymentError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {paymentError}
            </Alert>
          )}
        </>
      )}

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={loginDialogOpen}
        onClose={handleCloseLoginDialog}
        onLoginRedirect={handleLoginRedirect}
        onSignupRedirect={handleSignupRedirect}
      />
    </Box>
  );
}

export default ShoppingCart;
