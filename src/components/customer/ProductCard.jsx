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
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

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

  const hasStock = product?.stock > 0;
  const productName = product?.name || 'Unnamed Product';
  const productDesc = product?.description || '';
  const productPrice = product?.price ?? 0;

  const productImage =
    product?.images?.[0] ||
    product?.image ||
    product?.imageUrl ||
    'https://via.placeholder.com/300x200?text=No+Image';

  const categoryName =
    typeof product?.category === 'string'
      ? product.category
      : product?.category?.name || 'Uncategorized';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      aria-label={`Product: ${productName}`}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={180}
          image={productImage}
          alt={productName}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label={categoryName}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: 'white',
          }}
          aria-label={`Category: ${categoryName}`}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          noWrap
          title={productName}
        >
          {productName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,   // فقط 2 خط متن
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {productDesc}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(productPrice)}
          </Typography>
          <Chip
            icon={<Inventory fontSize="small" />}
            label={hasStock ? 'In Stock' : 'Out of Stock'}
            color={hasStock ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button
          variant="contained"
          startIcon={
            isAdding ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCart />
          }
          onClick={handleAddToCartClick}
          disabled={!hasStock || isAdding}
          aria-label={`Add ${productName} to cart`}
          fullWidth
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
        >
          {error}
        </Typography>
      )}
    </Card>
  );
};

export default ProductCard;
