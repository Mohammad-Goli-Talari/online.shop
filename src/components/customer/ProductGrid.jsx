import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import ProductCard from './ProductCard';

/**
 * ProductGrid component renders a responsive grid of products.
 * @param {object} props - The props for the component.
 * @param {Array<object>} props.products - The array of products to display.
 * @param {boolean} props.loading - The loading state for the initial fetch.
 * @param {string|null} props.error - The error message, if any.
 * @param {Function} props.onAddToCart - The function to handle adding a product to the cart.
 */
const ProductGrid = ({ products, loading, error, onAddToCart }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  if (!products || products.length === 0) {
    return (
      <Box textAlign="center" my={5} sx={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6">No products found.</Typography>
        <Typography color="text.secondary">Try adjusting your search or filters.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;