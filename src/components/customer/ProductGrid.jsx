// src/components/customer/ProductGrid.jsx
import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, onAddToCart }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '50vh' }} role="status" aria-live="polite">
        <CircularProgress size={60} aria-label="Loading products" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" role="alert" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box
        textAlign="center"
        my={5}
        sx={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        role="region"
        aria-live="polite"
        aria-label="No products found"
      >
        <Typography variant="h6">No products found.</Typography>
        <Typography color="text.secondary">Try adjusting your search or filters.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} aria-label="Product grid">
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
