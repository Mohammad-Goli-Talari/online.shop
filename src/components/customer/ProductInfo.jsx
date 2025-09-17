// src/components/customer/ProductInfo.jsx
import React from 'react';
import { Box, Typography, Chip, Skeleton, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductInfo = ({ product, loading }) => {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="text" width="80%" height={40} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="text" width="30%" height={25} />
      </Stack>
    );
  }

  if (!product) {
    return (
      <Typography variant="body1" color="error">
        Product not found.
      </Typography>
    );
  }

  // Safe destructuring with defaults
  const {
    name = '-',
    price = 0,
    description = 'No description available.',
    sku = 'N/A',
    stock = 0,
    category = null,
    specifications = [],
  } = product;

  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 0 } }}>
      {/* Product Name */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ transition: 'color 0.3s', '&:hover': { color: 'primary.main' } }}
      >
        {name}
      </Typography>

      {/* Price */}
      <Typography
        variant="h5"
        color="primary"
        gutterBottom
        sx={{ fontWeight: 'medium', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
      >
        ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
      </Typography>

      {/* Description */}
      <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {description}
      </Typography>

      {/* SKU, Stock, Category */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        my={2}
      >
        <Chip
          label={`SKU: ${sku}`}
          variant="outlined"
          sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
        />

        <Chip
          label={stock > 0 ? 'In Stock' : 'Out of Stock'}
          color={stock > 0 ? 'success' : 'error'}
          sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
        />

        {category && (
          <Typography
            variant="body2"
            component={Link}
            to={`/categories/${category.slug || ''}`}
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              transition: 'color 0.3s',
              '&:hover': { textDecoration: 'underline', color: 'primary.main' },
            }}
          >
            Category: {category.name || '-'}
          </Typography>
        )}
      </Stack>

      {/* Optional Product Specifications */}
      {specifications.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Specifications:
          </Typography>
          <Stack spacing={1}>
            {specifications.map((spec, index) => (
              <Typography
                key={index}
                variant="body2"
                color="text.secondary"
                sx={{ '&:hover': { color: 'primary.main', transition: 'color 0.3s' } }}
              >
                {spec}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ProductInfo;
