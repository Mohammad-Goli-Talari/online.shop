// src/components/customer/ProductReviews.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductReviews = ({ productId }) => (
  <Box>
    <Typography variant="h6" gutterBottom>Reviews</Typography>
    <Typography variant="body2" color="text.secondary">Reviews for product ID: {productId} will appear here.</Typography>
  </Box>
);

export default ProductReviews;
