// src/components/customer/RelatedProducts.jsx
import React, { useState, Suspense } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
  Modal,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import { Close as CloseIcon, Share as ShareIcon, CompareArrows } from '@mui/icons-material';
import ProductCard from './ProductCard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Typography color="error">Failed to load related products.</Typography>;
    }
    return this.props.children;
  }
}

const RelatedProducts = ({ products = [], onAddToCart, loading = false, onAddToComparison }) => {
  const theme = useTheme();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  let columns = 5;
  if (isXs) columns = 1;
  else if (isSm) columns = 2;
  else if (isMd) columns = 3;
  else if (isLg) columns = 4;

  const skeletons = Array.from(new Array(columns));

  const openQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const handleAddToCart = async (productId) => {
    try {
      await onAddToCart(productId, 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box mt={6}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Related Products
      </Typography>

      <ErrorBoundary>
        <Suspense
          fallback={
            <Box display="grid" gridTemplateColumns={`repeat(${columns}, 1fr)`} gap={2}>
              {skeletons.map((_, idx) => (
                <Skeleton key={idx} variant="rectangular" height={350} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          }
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            {loading
              ? skeletons.map((_, idx) => (
                  <Skeleton key={idx} variant="rectangular" height={350} sx={{ borderRadius: 1 }} />
                ))
              : products.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { transform: 'scale(1.04)', boxShadow: 6 },
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product.id)}
                      sx={{ flexGrow: 1 }}
                      aria-label={`Related product: ${product.name}, Price: $${product.price}`}
                    />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Tooltip title="Quick View">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openQuickView(product)}
                        >
                          Quick View
                        </Button>
                      </Tooltip>
                      <Tooltip title="Add to Comparison">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onAddToComparison?.(product)}
                        >
                          <CompareArrows fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Share">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigator.clipboard.writeText(window.location.href)}
                        >
                          <ShareIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
          </Box>
        </Suspense>
      </ErrorBoundary>

      {/* Quick View Modal */}
      <Modal open={!!quickViewProduct} onClose={closeQuickView}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 3,
            maxWidth: 600,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'hidden',
            outline: 'none',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={closeQuickView}
            aria-label="Close quick view modal"
          >
            <CloseIcon />
          </IconButton>
          {quickViewProduct && (
            <>
              <Typography variant="h6" gutterBottom noWrap>
                {quickViewProduct.name}
              </Typography>
              <Box
                component="img"
                src={quickViewProduct.images?.[0]}
                alt={quickViewProduct.name}
                sx={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', mb: 2 }}
                loading="lazy"
              />
              <Typography variant="subtitle1" color="primary.main">
                ${quickViewProduct.price}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleAddToCart(quickViewProduct.id)}
              >
                Add to Cart
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default RelatedProducts;
