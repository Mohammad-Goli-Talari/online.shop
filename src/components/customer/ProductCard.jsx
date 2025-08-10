import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Box, Button, CircularProgress } from '@mui/material';
import { AddShoppingCart, Inventory } from '@mui/icons-material';

/**
 * Formats a number into a currency string (e.g., USD).
 * @param {number} price - The price to format.
 * @returns {string} The formatted currency string.
 */
const formatCurrency = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

/**
 * ProductCard component displays individual product information and handles adding to cart.
 * @param {object} props - The props for the component.
 * @param {object} props.product - The product object to display.
 * @param {Function} props.onAddToCart - The function to call when 'Add to Cart' is clicked.
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCartClick = async () => {
    if (!product || !product.id || isAdding) return;
    
    setIsAdding(true);
    await onAddToCart(product.id, 1); // Pass product ID and quantity
    setIsAdding(false);
  };

  const hasStock = product.stock > 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
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
          />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap title={product.name}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden' }}>
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
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;