// src/pages/Home.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

import CustomerLayout from '../layouts/CustomerLayout';
import ProductGrid from '../components/customer/ProductGrid';
import CategoryFilter from '../components/customer/CategoryFilter';
import CartService from '../services/cartService';
import { mockDataStore } from '../mocks/data/mockData';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ search: '', categoryId: null, inStock: true });
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const observer = useRef();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = () => {
      if (page === 1) setLoading(true);
      else setIsPaginating(true);
      setError(null);

      try {
        let allProducts = mockDataStore.getProducts();

        if (filters.search) {
          allProducts = allProducts.filter(p =>
            p.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.categoryId) {
          allProducts = allProducts.filter(p => {
            const prodCatId =
              p.categoryId ??
              p.category_id ??
              p.catId ??
              p.category?.id ??
              p.category;
            return String(prodCatId) === String(filters.categoryId);
          });
        }
        if (filters.inStock) {
          allProducts = allProducts.filter(p => p.stock > 0);
        }

        const itemsPerPage = 12;
        const startIndex = (page - 1) * itemsPerPage;
        const paginatedItems = allProducts.slice(startIndex, startIndex + itemsPerPage);

        if (!isMounted) return;

        setProducts(prev =>
          page === 1 ? paginatedItems : [...prev, ...paginatedItems]
        );
        setHasMore(startIndex + itemsPerPage < allProducts.length);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsPaginating(false);
        }
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [filters]);

  const lastProductElementRef = useCallback(
    node => {
      if (loading || isPaginating || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isPaginating, hasMore]
  );

  const handleSearch = searchQuery => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  const handleCategorySelect = categoryId => {
    setFilters(prev => ({ ...prev, categoryId }));
    if (isMobile) setFilterDrawerOpen(false);
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      await CartService.addToCart(productId, quantity);
      setSnackbar({
        open: true,
        message: 'Product added to cart successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to add product to cart.',
        severity: 'error'
      });
      console.error(err);
    }
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <CustomerLayout onSearch={handleSearch}>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Our Store
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover our exclusive collection of products.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {isMobile ? (
          <Grid item xs={12}>
            <Button
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
            <Drawer
              anchor="left"
              open={isFilterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
            >
              <Box sx={{ width: 250, p: 2 }}>
                <CategoryFilter onCategorySelect={handleCategorySelect} />
              </Box>
            </Drawer>
          </Grid>
        ) : (
          <Grid item md={3}>
            <CategoryFilter onCategorySelect={handleCategorySelect} />
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
            selectedCategoryId={filters.categoryId}
          />
          <div ref={lastProductElementRef} />
          {isPaginating && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
          {!hasMore && products.length > 0 && (
            <Box textAlign="center" my={4}>
              <Typography color="text.secondary">
                You've reached the end!
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CustomerLayout>
  );
};

export default Home;
