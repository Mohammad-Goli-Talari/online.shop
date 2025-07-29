// src/pages/admin/products/index.jsx
import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ProductTable from '../../../components/admin/ProductTable';
import products from '../../../mock/products';

const ProductListPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          Products
        </Typography>
        <Button variant="contained" color="primary">
          Add Product
        </Button>
      </Stack>

      <ProductTable products={products} />
    </Container>
  );
};

export default ProductListPage;