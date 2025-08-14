// src/components/customer/ProductGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
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
      <Grid
        container
        spacing={2}
        aria-label="Product grid"
        sx={{ width: '100%', m: 0, display: 'flex !important', flexWrap: 'wrap !important' }}
      >
        {filteredProducts.map(product => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={3}
            lg={2.4}
            xl={2}
            sx={{
              flexGrow: 0,
              flexBasis: {
                xs: '100%',
                sm: '50%',
                md: '25%',
                lg: '20%',
                xl: '16.6667%'
              },
              maxWidth: {
                xs: '100%',
                sm: '50%',
                md: '25%',
                lg: '20%',
                xl: '16.6667%'
              }
            }}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
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
