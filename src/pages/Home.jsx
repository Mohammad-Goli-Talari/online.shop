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
  Alert,
  IconButton,
  Badge
} from '@mui/material';
import { FilterList, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

import CustomerLayout from '../layouts/CustomerLayout';
import ProductGrid from '../components/customer/ProductGrid';
import CategoryFilter from '../components/customer/CategoryFilter';
import ShoppingCart from '../components/customer/ShoppingCart';
import { useCart } from '../context/useCart';
import ProductService from '../services/productService';

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
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const observer = useRef();

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setIsPaginating(true);
      setError(null);

      try {
        if (!filters.search) {
          const params = {
            page,
            limit: 12,
            categoryId: filters.categoryId || undefined,
            inStock: filters.inStock
          };
          
          const response = await ProductService.getProducts(params, { signal: abortController.signal });
          const products = response?.products || [];
          
          if (!isMounted || abortController.signal.aborted) return;
          setProducts(prev => page === 1 ? products : [...prev, ...products]);
          setHasMore(products.length === 12); // If we got full page, there might be more
        }
      } catch (err) {
        if (!isMounted || abortController.signal.aborted || err.name === 'AbortError') return;
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
          setIsPaginating(false);
        }
      }
    };

    fetchProducts();
    return () => { 
      isMounted = false; 
      abortController.abort();
    };
  }, [filters.categoryId, filters.inStock, page, filters.search]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [filters.categoryId, filters.inStock]);

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

  const handleSearch = useCallback(async (searchQuery, abortSignal) => {
    try {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      setError(null);
      
      setFilters(prev => ({ ...prev, search: searchQuery }));
      
      if (!searchQuery.trim()) {
        return Promise.resolve();
      }
      
      setLoading(true);
      const params = {
        page: 1,
        limit: 12,
        search: searchQuery,
        categoryId: filters.categoryId || undefined,
        inStock: filters.inStock
      };

      const response = await ProductService.searchProducts(params, { signal: abortSignal });
      
      if (abortSignal?.aborted) {
        return Promise.resolve();
      }
      
      const { results, pagination } = response;
      setProducts(results || []);
      setHasMore(pagination?.hasNext || false);
      setPage(2);
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Search failed');
        setProducts([]);
        setHasMore(false);
      }
    } finally {
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  }, [filters.categoryId, filters.inStock]);
  const handleCategorySelect = categoryId => {
    setFilters(prev => ({ ...prev, categoryId }));
    if (isMobile) setFilterDrawerOpen(false);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity);
      setSnackbar({ open: true, message: 'Product added to cart!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add product.', severity: 'error' });
    }
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <CustomerLayout
      onSearch={handleSearch}
      cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
      renderCartIcon={
        <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
          <Badge badgeContent={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      }
    >
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>Welcome to Our Store</Typography>
        <Typography variant="h6" color="text.secondary">Discover our exclusive collection of products.</Typography>
      </Box>

      <Grid container spacing={4}>
        {isMobile ? (
          <Grid size={12}>
            <Button startIcon={<FilterList />} onClick={() => setFilterDrawerOpen(true)}>Filters</Button>
            <Drawer anchor="left" open={isFilterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
              <Box sx={{ width: 250, p: 2 }}>
                <CategoryFilter onCategorySelect={handleCategorySelect} />
              </Box>
            </Drawer>
          </Grid>
        ) : (
          <Grid size={{ md: 3 }}>
            <CategoryFilter onCategorySelect={handleCategorySelect} />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 9 }}>
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onAddToCart={handleAddToCart}
            selectedCategoryId={filters.categoryId}
          />
          <div ref={lastProductElementRef} />
          {isPaginating && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
          {!hasMore && products.length > 0 && <Box textAlign="center" my={4}><Typography color="text.secondary">You've reached the end!</Typography></Box>}
        </Grid>
      </Grid>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 400 }, p: 2 }}>
          <ShoppingCart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
          />
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CustomerLayout>
  );
};

export default Home;
