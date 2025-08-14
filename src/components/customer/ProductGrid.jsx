// src/components/customer/ProductGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, onAddToCart, selectedCategoryId }) => {
  const filteredProducts = selectedCategoryId
    ? products.filter(p => {
        const prodCatId =
          p.categoryId ??
          p.category_id ??
          p.catId ??
          p.category?.id ??
          p.category;
        return String(prodCatId) === String(selectedCategoryId);
      })
    : products;

  if (loading && filteredProducts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" my={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Box textAlign="center" my={4}>
        <Typography>No products found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        aria-label="Product grid"
        role="list"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
            xl: 'repeat(6, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {filteredProducts.map(product => (
          <Box key={product.id} role="listitem">
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAddToCart: PropTypes.func.isRequired,
  selectedCategoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ProductGrid.defaultProps = {
  loading: false,
  error: null,
  selectedCategoryId: null,
};

export default ProductGrid;
