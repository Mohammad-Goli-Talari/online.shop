import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Skeleton,
} from '@mui/material';
import { AddShoppingCart, Inventory } from '@mui/icons-material';
import { getProductImage } from '../../utils/fallbackImages.js';
import useAuth from '../../hooks/useAuth';
import LoginRequiredDialog from '../common/LoginRequiredDialog';
import { checkAuthenticationForAction, AUTH_MESSAGES } from '../../utils/authUtils';

const formatCurrency = price =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleCardClick = (event) => {
    if (event.target.closest('.add-to-cart-btn')) return;
    if (product?.id) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    
    const authResult = checkAuthenticationForAction(isAuthenticated, 'add_to_cart');
    if (!authResult.success) {
      setShowLoginDialog(true);
      return;
    }
    
    if (!onAddToCart || !product?.id) return;
    
    setAddingToCart(true);
    setAddToCartError(null);
    
    try {
      await onAddToCart(product.id, 1);
    } catch (error) {
      setAddToCartError(error.message || 'Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleImageError = (e) => {
    let fallbackText = 'Product';
    
    if (product?.name && product.name.trim() && product.name !== 'Unnamed Product') {
      fallbackText = product.name.substring(0, 15);
    } else if (product?.category) {
      const catName = typeof product.category === 'string' ? product.category : product.category.name;
      if (catName && catName.trim() && catName !== 'Uncategorized') {
        fallbackText = catName;
      }
    }
    
    e.target.src = `https://placehold.co/300x180/4F46E5/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth/sign-in', { 
      state: { 
        from: `/products/${product?.id}`,
        action: 'add_to_cart' 
      } 
    });
  };

  const handleSignupRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth/sign-up', { 
      state: { 
        from: `/products/${product?.id}`,
        action: 'add_to_cart' 
      } 
    });
  };

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  const hasStock = product?.stock > 0;
  const productName = product?.name || 'Unnamed Product';
  const productDesc = product?.description || '';
  const productPrice = product?.price ?? 0;

  const productImage = getProductImage(
    product?.images?.[0] || product?.image || product?.imageUrl,
    product?.category,
    product?.id,
    300,
    200
  );

  const categoryName =
    typeof product?.category === 'string'
      ? product.category
      : product?.category?.name || 'Uncategorized';

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 370,
          transition: 'box-shadow 0.3s',
          '&:hover': { boxShadow: 6, cursor: 'pointer' },
        }}
        aria-label={`Product: ${productName}`}
        onClick={handleCardClick}
        tabIndex={0}
      >
      <Box sx={{ position: 'relative' }}>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 1,
            }}
          />
        )}
        
        <CardMedia
          component="img"
          height={180}
          image={productImage}
          alt={`Image of ${productName} (${categoryName})`}
          sx={{ 
            objectFit: 'cover',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
        />
        
        {!imageLoading && (
          <Chip
            label={categoryName}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
            }}
            aria-label={`Category: ${categoryName}`}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          noWrap
          title={productName}
        >
          {productName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {productDesc}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {formatCurrency(productPrice)}
          </Typography>
          <Chip
            icon={<Inventory fontSize="small" />}
            label={hasStock ? 'In Stock' : 'Out of Stock'}
            color={hasStock ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
        <Button
          className="add-to-cart-btn"
          variant="contained"
          color="primary"
          size="medium"
          startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={!hasStock || addingToCart}
          aria-label={addingToCart ? "Adding to cart..." : "Add to cart"}
          fullWidth
          sx={{ maxWidth: '100%', fontWeight: 'bold', fontSize: '1rem' }}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        {addToCartError && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ mt: 1, textAlign: 'center', fontSize: '0.75rem' }}
          >
            {addToCartError}
          </Typography>
        )}
      </CardActions>
      </Card>

      <LoginRequiredDialog
        open={showLoginDialog}
        onClose={handleCloseLoginDialog}
        onLoginRedirect={handleLoginRedirect}
        onSignupRedirect={handleSignupRedirect}
      />
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    stock: PropTypes.number,
    images: PropTypes.array,
    image: PropTypes.string,
    imageUrl: PropTypes.string,
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string })
    ]),
  }).isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
