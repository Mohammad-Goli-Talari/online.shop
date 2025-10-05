import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AdminLayout from '../../../layouts/AdminLayout';
import ProductTable from '../../../components/admin/ProductTable';
import AddProductModal from '../../../components/admin/AddProductModal';
import ProductService from '../../../services/productService';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const hasInitialized = useRef(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getProducts({ limit: 9999 });
      const items = res.products || []; // Changed from res.items to res.products
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(items);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadProducts();
    }
  }, []);

  const handleProductAdded = (createdProduct) => {
    setProducts(prev => [createdProduct, ...prev]);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product.id);
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await ProductService.deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    }
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
            <Typography variant="body2" color="text.secondary">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => setOpenModal(true)}>Add Product</Button>
        </Stack>

        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          loading={loading}
          error={error}
          hasMore={false}
          onLoadMore={() => {}}
        />

        <AddProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={handleProductAdded}
        />
      </Container>
    </AdminLayout>
  );
};

export default ProductListPage;
