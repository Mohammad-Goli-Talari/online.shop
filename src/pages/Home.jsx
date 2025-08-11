import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Grid, Box, Typography, CircularProgress, Button, Drawer, useTheme, useMediaQuery, Snackbar, Alert
} from '@mui/material';
import { FilterList } from '@mui/icons-material';

import CustomerLayout from '../layouts/CustomerLayout';
import ProductGrid from '../components/customer/ProductGrid';
import CategoryFilter from '../components/customer/CategoryFilter';
import ProductService from '../services/productService';
import CartService from '../services/cartService';

/**
 * The main Home page component for customers.
 * It manages state for products, filters, pagination, and user feedback.
 */
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

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsPaginating(true);
      }
      setError(null);

      try {
        const response = await ProductService.getProducts({ ...filters, page, limit: 12 });
        
        if (!isMounted) return;

        const productsData = Array.isArray(response) ? response : response?.data || [];
        const paginationInfo = response?.pagination;

        setProducts(prev => (page === 1 ? productsData : [...prev, ...productsData]));
        
        if (paginationInfo) {
          setHasMore(paginationInfo.totalPages > page);
        } else {
          setHasMore(productsData.length > 0);
        }
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        // --- FIX: Correctly handle the finally block ---
        if (isMounted) {
          setLoading(false);
          setIsPaginating(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [filters, page]);

  useEffect(() => {
    if (filters.search !== '' || filters.categoryId !== null) {
      setPage(1);
      setHasMore(true);
    }
  }, [filters]);

  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading || isPaginating || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, isPaginating, hasMore]);

  const handleSearch = (searchQuery) => {
    setFilters(prev => ({ ...prev, search: searchQuery, categoryId: null }));
  };

  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({ ...prev, search: '', categoryId: categoryId }));
    if (isMobile) setFilterDrawerOpen(false);
  };
  
  const handleAddToCart = async (productId, quantity) => {
    try {
      await CartService.addToCart(productId, quantity);
      setSnackbar({ open: true, message: 'Product added to cart successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add product to cart.', severity: 'error' });
      console.error(err);
    }
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const categoryFilterComponent = <CategoryFilter onCategorySelect={handleCategorySelect} />;

  return (
    <CustomerLayout onSearch={handleSearch}>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>Welcome to Our Store</Typography>
        <Typography variant="h6" color="text.secondary">Discover our exclusive collection of products.</Typography>
      </Box>

      <Grid container spacing={4}>
        {isMobile ? (
          <Grid item xs={12}>
            <Button startIcon={<FilterList />} onClick={() => setFilterDrawerOpen(true)}>Filters</Button>
            <Drawer anchor="left" open={isFilterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
              <Box sx={{ width: 250, p: 2 }}>{categoryFilterComponent}</Box>
            </Drawer>
          </Grid>
        ) : (
          <Grid item md={3}>{categoryFilterComponent}</Grid>
        )}
        
        <Grid item xs={12} md={9}>
          <ProductGrid products={products} loading={loading} error={error} onAddToCart={handleAddToCart} />
          
          <div ref={lastProductElementRef} />

          {isPaginating && (
            <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
          )}

          {!hasMore && products.length > 0 && (
            <Box textAlign="center" my={4}><Typography color="text.secondary">You've reached the end!</Typography></Box>
          )}
        </Grid>
      </Grid>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CustomerLayout>
  );
};

export default Home;