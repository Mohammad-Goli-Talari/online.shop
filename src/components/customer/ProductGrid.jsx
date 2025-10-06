import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Alert } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../skeletons';
import EmptyState from '../common/EmptyState';
import { useTranslation } from '../../hooks/useTranslation.js';

const ProductGrid = ({ products, loading = false, error = null, onAddToCart, selectedCategoryId = null }) => {
  const { t } = useTranslation();
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
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <ProductCardSkeleton key={`product-skeleton-${index}`} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" my={4}>
        <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>{error}</Alert>
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <EmptyState 
        icon={Inventory2Outlined}
        title={t('ui.noProductsFound')}
        description={
          selectedCategoryId 
            ? 'No products available in the selected category. Try browsing other categories or check back later.' 
            : 'We don\'t have any products available right now. Please check back later or contact us for more information.'
        }
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        aria-label={t('ui.productGrid')}
        role="list"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {filteredProducts.map(product => (
          <Box key={product.id} role="listitem" tabIndex={0}>
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

export default ProductGrid;
