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
  // --- FIX: Removed unused 'pagination' state ---
  // const [pagination, setPagination] = useState(null); 
  const [openModal, setOpenModal] = useState(false);
  const hasInitialized = useRef(false);

  // Load initial products just once
  const loadInitialProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch initial data, assuming mock API returns everything
      const response = await ProductService.getProducts({ limit: 9999 });
      const items = response.items || [];
      // Initial sort by date to show newest first
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(items);
      // --- FIX: Removed unused setter call ---
      // setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    loadInitialProducts();
  }, [loadInitialProducts]);

  // Optimistic Update Logic: Instantly adds the new product to the UI
  const handleProductAdded = (newProductData) => {
    setProducts(prevProducts => [newProductData, ...prevProducts]);
  };

  const handleEditProduct = (product) => {
    console.log('Editing product:', product.id);
  };

  const handleDeleteProduct = (product) => {
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
            <Typography variant="h5" fontWeight={600}>Products</Typography>
            {products && (
              <Typography variant="body2" color="text.secondary">
                {products.length} products found
              </Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add Product
          </Button>
        </Stack>

        <ProductTable 
          products={products}
          onLoadMore={() => {}} // No-op for mock, as all data is loaded
          hasMore={false}       // No-op for mock
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