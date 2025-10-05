import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Typography,
  useMediaQuery,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getProductImage } from '../../utils/fallbackImages.js';
import EmptyState from '../common/EmptyState';

const ProductTable = ({
  products,
  onLoadMore,
  hasMore,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const tableRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleScroll = useCallback(async () => {
    if (!tableRef.current || !hasMore || loading || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8) {
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, loading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const currentRef = tableRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [handleScroll]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleDateString();
    } catch {
      return '-';
    }
  };

  const getProductImageSrc = (product) => {
    const originalImage = product.images && product.images.length > 0 ? product.images[0] : null;
    return getProductImage(originalImage, product.category, product.id, 48, 48);
  };

  const handleImageError = (e, product) => {
    const productId = product?.id || product?._id;
    if (productId && !imageErrors.has(productId)) {
      setImageErrors(prev => new Set([...prev, productId]));
      // Force fallback image by passing null as original image
      const fallbackUrl = getProductImage(null, product.category, productId, 48, 48);
      e.target.src = fallbackUrl;
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <TableContainer
        component={Paper}
        ref={tableRef}
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <Table size={isMobile ? 'small' : 'medium'} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id || product._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    #{product.id || product._id || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: isMobile ? 32 : 48,
                      height: isMobile ? 32 : 48,
                      borderRadius: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                    }}
                  >
                    <img
                      src={getProductImageSrc(product)}
                      alt={product.name || 'Product'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => handleImageError(e, product)}
                      loading="lazy"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {product.name || '-'}
                    </Typography>
                    {product.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 200,
                        }}
                      >
                        {product.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {product.sku || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.category?.name || product.categoryName || 'No Category'}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.stock != null ? product.stock : '-'}
                    size="small"
                    color={
                      product.stock > 10
                        ? 'success'
                        : product.stock > 0
                        ? 'warning'
                        : 'error'
                    }
                    variant={product.stock === 0 ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={product.isActive ? 'success' : 'default'}
                    variant={product.isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(product.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onEdit && onEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete && onDelete(product)}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {(loading || isLoadingMore) && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      {isLoadingMore ? 'Loading more products...' : 'Loading products...'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!loading && !isLoadingMore && !hasMore && products.length > 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No more products to load
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 2 }}>
                  <EmptyState 
                    icon={Inventory2Outlined}
                    title="No products found"
                    description="Start by adding your first product to the inventory"
                    variant="compact"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductTable;
