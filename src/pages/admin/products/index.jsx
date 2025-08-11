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
  const [pagination, setPagination] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const currentPageRef = useRef(1);
  const hasInitialized = useRef(false);

  const loadProducts = useCallback(async (reset = false) => {
    // Only show main loader on initial/full reset
    if (reset) {
      setLoading(true);
      currentPageRef.current = 1;
    }
    setError(null);
    
    try {
      const page = currentPageRef.current;
      const response = await ProductService.getProducts({ 
        page, 
        limit: 20
      });
      
      if (reset) {
        setProducts(response.items || []);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = (response.items || []).filter(product => !existingIds.has(product.id));
          return [...prev, ...newProducts];
        });
      }
      
      setPagination(response.pagination);
      
      // Safer page increment: only if there's a next page
      if (response.pagination && response.pagination.hasNext) {
        currentPageRef.current += 1;
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    loadProducts(true);
  }, [loadProducts]);

  const handleLoadMore = async () => {
    if (pagination && pagination.hasNext && !loading) {
      // Pass 'false' to indicate it's not a reset
      await loadProducts(false);
    }
  };

  const handleEditProduct = (product) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Editing product:', product.id);
  };

  const handleDeleteProduct = (product) => {
    // TODO: Show confirmation dialog and delete product
    console.log('Deleting product:', product.id);
  };

  const hasMore = pagination ? pagination.hasNext : false;

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
            {pagination && (
              <Typography variant="body2" color="text.secondary">
                Showing {products.length} of {pagination.totalItems} products
              </Typography>
            )}
          </Box>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add Product
          </Button>
        </Stack>

        <ProductTable 
          products={products}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          // Better loading UX: only show full-table loader on initial load
          loading={loading && products.length === 0}
          error={error}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </Container>
      
      {/* Modal is outside the main layout Stack for cleaner structure */}
      <AddProductModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        // CRITICAL FIX: Ensure the list is reset on success
        onSuccess={() => loadProducts(true)} 
      />
    </AdminLayout>
  );
};

export default ProductListPage;