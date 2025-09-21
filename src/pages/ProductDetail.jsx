// src/pages/ProductDetail.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Alert,
  Button,
  Modal,
  IconButton,
} from '@mui/material';
import { Share as ShareIcon, Close as CloseIcon } from '@mui/icons-material';

import useProductDetail from '../hooks/useProductDetail.js';
import Breadcrumbs from '../components/customer/Breadcrumbs.jsx';
import ProductImageGallery from '../components/customer/ProductImageGallery.jsx';
import ProductInfo from '../components/customer/ProductInfo.jsx';
import ProductActions from '../components/customer/ProductActions.jsx';
import SEOHead from '../components/common/SEOHead.jsx';

const RelatedProducts = lazy(() => import('../components/customer/RelatedProducts.jsx'));
const ProductReviews = lazy(() => import('../components/customer/ProductReviews.jsx'));

const ProductDetail = () => {
  const { id: rawId } = useParams();
  const id = Number(rawId);

  const {
    product,
    relatedProducts,
    quantity,
    loading,
    error,
    cartLoading,
    cartSuccess,
    incrementQuantity,
    decrementQuantity,
    addToCart
  } = useProductDetail(id);

  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Recently viewed
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const updated = [product, ...viewed.filter(p => p.id !== product.id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentlyViewed(updated);
    }
  }, [product]);

  // Add product to comparison
  const handleAddToComparison = () => {
    if (product && !comparisonList.find(p => p.id === product.id)) {
      setComparisonList([...comparisonList, product].slice(0, 4));
    }
  };

  const openQuickView = (prod) => setQuickViewProduct(prod);
  const closeQuickView = () => setQuickViewProduct(null);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={50} />
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Product not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* SEO */}
      <SEOHead
        title={product.name ? `${product.name} | MyShop` : 'Product | MyShop'}
        description={product.description ? product.description.slice(0, 160) : 'Product details and information'}
        ogTitle={product.name || 'Product'}
        ogDescription={product.description ? product.description.slice(0, 160) : 'Product details and information'}
        ogImage={product.images?.[0] || ''}
        structuredData={product ? {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images || [],
          "description": product.description,
          "sku": product.sku,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": product.price,
            "availability": (product.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.averageRating || 5,
            "reviewCount": product.reviewCount || 0
          }
        } : null}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs product={product} loading={loading} />

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Left: Product Images */}
        <Grid item xs={12} md={6}>
          <ProductImageGallery images={product.images || []} productName={product.name} />
          <Box sx={{ mt: 1 }}>
            <Button startIcon={<ShareIcon />} onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Share
            </Button>
          </Box>
        </Grid>

        {/* Right: Product Info & Actions */}
        <Grid item xs={12} md={6}>
          <ProductInfo product={product} />
          <Box sx={{ mt: 3 }}>
            <ProductActions
              quantity={quantity}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              addToCart={addToCart}
              cartLoading={cartLoading}
              cartSuccess={cartSuccess}
              stock={product.stock}
            />
            <Button sx={{ mt: 2 }} variant="outlined" onClick={handleAddToComparison}>
              Add to Comparison
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={200} />}>
          <RelatedProducts 
            products={relatedProducts}
            onAddToCart={addToCart}
            onAddToComparison={openQuickView} 
          />
        </Suspense>
      </Box>

      {/* Product Reviews */}
      <Box sx={{ mt: 6 }}>
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={150} />}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </Box>

      {/* Zoom Modal */}
      <Modal open={zoomModalOpen} onClose={() => setZoomModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
            maxWidth: 600,
            outline: 'none',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setZoomModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} ${idx + 1}`}
              style={{ width: '100%', marginBottom: 8 }}
              loading="lazy"
            />
          ))}
        </Box>
      </Modal>

      {/* Quick View Modal */}
      <Modal open={!!quickViewProduct} onClose={closeQuickView}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 2,
            maxWidth: 600,
            outline: 'none',
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={closeQuickView}>
            <CloseIcon />
          </IconButton>
          {quickViewProduct && (
            <>
              <Typography variant="h6">{quickViewProduct.name}</Typography>
              <img
                src={quickViewProduct.images?.[0]}
                alt={quickViewProduct.name}
                style={{ width: '100%', marginBottom: 8 }}
                loading="lazy"
              />
              <Typography>${quickViewProduct.price}</Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Recently Viewed */}
      {recentlyViewed.length > 1 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>Recently Viewed</Typography>
          <Grid container spacing={2}>
            {recentlyViewed.filter(p => p.id !== product.id).map(p => (
              <Grid item xs={6} sm={3} key={p.id}>
                <img src={p.images?.[0]} alt={p.name} style={{ width: '100%' }} loading="lazy" />
                <Typography variant="body2">{p.name}</Typography>
                <Button variant="text" onClick={() => openQuickView(p)}>Quick View</Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Comparison List */}
      {comparisonList.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>Comparison</Typography>
          <Grid container spacing={2}>
            {comparisonList.map(p => (
              <Grid item xs={6} sm={3} key={p.id}>
                <img src={p.images?.[0]} alt={p.name} style={{ width: '100%' }} loading="lazy" />
                <Typography variant="body2">{p.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetail;
