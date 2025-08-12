// src/components/customer/ProductCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { AddShoppingCart, Inventory } from '@mui/icons-material';

const formatCurrency = price =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCartClick = async () => {
    if (!product?.id || isAdding) return;

    setIsAdding(true);
    setError(null);

    try {
      await onAddToCart(product.id, 1);
    } catch (err) {
      setError(err.message || 'Failed to add product to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const hasStock = product.stock > 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      aria-label={`Product: ${product.name}`}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label={product.category?.name || 'Uncategorized'}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}
          aria-label={`Category: ${product.category?.name || 'Uncategorized'}`}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          noWrap
          title={product.name}
          aria-label={`Product name: ${product.name}`}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: 40, overflow: 'hidden' }}
          aria-label={`Description: ${product.description}`}
        >
          {product.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(product.price)}
          </Typography>
          <Chip
            icon={<Inventory fontSize="small" />}
            label={hasStock ? 'In Stock' : 'Out of Stock'}
            color={hasStock ? 'success' : 'error'}
            variant="outlined"
            size="small"
            aria-label={hasStock ? 'In Stock' : 'Out of Stock'}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={isAdding ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCart />}
          onClick={handleAddToCartClick}
          disabled={!hasStock || isAdding}
          aria-label={isAdding ? 'Adding to cart' : 'Add to cart'}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardActions>
      {error && (
        <Typography
          variant="body2"
          color="error"
          textAlign="center"
          sx={{ px: 2, pb: 1 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Typography>
      )}
    </Card>
  );
};

export default ProductCard;
