// src/pages/admin/products/index.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ProductTable from '../../../components/admin/ProductTable';
import AdminLayout from '../../../layouts/AdminLayout';
import ProductService from '../../../services/productService';
import AddProductModal from '../../../components/admin/AddProductModal';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const hasInitialized = useRef(false);

  // Load initial products only once
  const loadInitialProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProductService.getProducts({ limit: 9999 });
      const items = response.items || [];
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(items);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadInitialProducts();
    }
  }, [loadInitialProducts]);

  // Optimistic update: add new product instantly
  const handleProductAdded = (newProductData) => {
    setProducts(prev => [newProductData, ...prev]);
  };

  const handleEditProduct = (product) => {
    // TODO: Implement Edit functionality if needed
    console.log('Editing product:', product.id);
  };

  const handleDeleteProduct = (product) => {
    // TODO: Implement Delete functionality if needed
    console.log('Deleting product:', product.id);
  };

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add Product
          </Button>
        </Stack>

        <ProductTable
          products={products}
          onLoadMore={() => {}}
          hasMore={false}
          loading={loading}
          error={error}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </Container>

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleProductAdded}
      />
    </AdminLayout>
  );
};

export default ProductListPage;