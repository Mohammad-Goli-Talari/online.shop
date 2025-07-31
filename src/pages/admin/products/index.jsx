import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ProductTable from '../../../components/admin/ProductTable';
import AdminLayout from '../../../layouts/AdminLayout';
import AddProductModal from '../../../components/admin/AddProductModal';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentPageRef = useRef(1);

  // Mock load products
  const loadProducts = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API response
      const mockResponse = {
        items: [
          { id: 'p1', name: 'Sample Product 1', sku: 'sample-product-1', price: 99, category: 'cat1' },
          { id: 'p2', name: 'Sample Product 2', sku: 'sample-product-2', price: 150, category: 'cat2' },
        ],
        pagination: { totalItems: 2, hasNext: false, currentPage: 1 },
      };
      if (reset) {
        setProducts(mockResponse.items);
        currentPageRef.current = 1;
      } else {
        setProducts((prev) => [...prev, ...mockResponse.items]);
        currentPageRef.current += 1;
      }
      setPagination(mockResponse.pagination);
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [loadProducts]);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
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
            {pagination && (
              <Typography variant="body2" color="text.secondary">
                Showing {products.length} of {pagination.totalItems} products
              </Typography>
            )}
          </Box>

          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            Add Product
          </Button>

          <AddProductModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onProductAdded={handleAddProduct}
          />
        </Stack>

        <ProductTable products={products} loading={loading} error={error} />
      </Container>
    </AdminLayout>
  );
};

export default ProductListPage;
