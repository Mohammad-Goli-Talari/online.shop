// src/components/admin/ProductTable.jsx
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
import { useTheme } from '@mui/material/styles';

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

  const getProductImage = (images) => {
    return images && images.length > 0 ? images[0] : null;
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
                  <Avatar
                    src={getProductImage(product.images)}
                    variant="square"
                    sx={{
                      width: isMobile ? 32 : 48,
                      height: isMobile ? 32 : 48,
                    }}
                  />
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
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found
                  </Typography>
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
