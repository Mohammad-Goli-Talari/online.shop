// src/components/customer/ShoppingCart.jsx
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

function ShoppingCart({ cartItems, removeFromCart, updateQuantity, clearCart }) {
  const getName = (item) => item?.product?.name || item?.name || 'Unknown';
  const getPrice = (item) => item?.product?.price || item?.price || 0;
  const getQuantity = (item) => item?.quantity || 1;
  const getImage = (item) =>
    (item?.product?.images?.[0] || item?.product?.image || item?.image || '');

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

  return (
    <Box sx={{ p: 2, minWidth: 320 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Shopping Cart</Typography>
        {cartItems.length > 0 && (
          <Button variant="outlined" color="secondary" size="small" onClick={clearCart}>
            Clear Cart
          </Button>
        )}
      </Box>

      {cartItems.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item, idx) => (
              <ListItem key={item.id || idx} divider alignItems="flex-start">
                {getImage(item) && (
                  <img
                    src={getImage(item)}
                    alt={getName(item)}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 12 }}
                  />
                )}

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
            onClick={() => alert('Payment gateway will be added soon!')}
          >
            Payment and purchase completion
          </Button>
        </>
      )}
    </Box>
  );
}

export default ShoppingCart;
