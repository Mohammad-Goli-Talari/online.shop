

// Only keep one clean version of ShoppingCart

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, Button, Divider } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function ShoppingCart({ cartItems, removeFromCart }) {
  // Support both {name, price} and {product: {name, price}}
  const getName = (item) => item.product?.name || item.name;
  const getPrice = (item) => item.product?.price || item.price;
  const getQuantity = (item) => item.quantity || 1;
  const getImage = (item) => item.product?.images?.[0] || item.product?.image || item.image || '';
  const totalPrice = cartItems.reduce((acc, item) => acc + getPrice(item) * getQuantity(item), 0);

  return (
    <Box sx={{ p: 2, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} divider alignItems="flex-start" secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                {getImage(item) && (
                  <img src={getImage(item)} alt={getName(item)} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 12 }} />
                )}
                <ListItemText
                  primary={getName(item)}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {getQuantity(item)} x ${getPrice(item)}
                      </Typography>
                      {getQuantity(item) > 1 && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          (${getPrice(item) * getQuantity(item)} total)
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
            <Typography variant="subtitle1" color="primary.main" fontWeight="bold">${totalPrice}</Typography>
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
