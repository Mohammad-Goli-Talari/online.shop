// src/components/customer/ProductInfo.jsx
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProductInfo = ({ product }) => {
  if (!product) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{product.name}</Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        SKU: {product.sku}
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom>
        ${product.price.toFixed(2)}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {product.description}
      </Typography>
      {product.category && (
        <Box sx={{ mt: 2 }}>
          <Chip
            label={product.category.name}
            component={RouterLink}
            to={`/category/${product.category.slug}`}
            clickable
            color="secondary"
          />
        </Box>
      )}
      <Typography sx={{ mt: 1 }} color={product.stock > 0 ? 'green' : 'error'}>
        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </Typography>
    </Box>
  );
};

export default ProductInfo;
