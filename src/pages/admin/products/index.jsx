// src/pages/admin/products/index.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ProductTable from '../../../components/admin/ProductTable';
import products from '../../../mock/products';
import AdminLayout from '../../../layouts/AdminLayout';

const ProductListPage = () => {
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Product Management
          </Typography>
          <Button variant="contained">Add Product</Button>
        </Box>

        <ProductTable products={products} />
      </Box>
    </AdminLayout>
  );
};

export default ProductListPage;
