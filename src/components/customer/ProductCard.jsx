// src/components/customer/ProductCard.jsx
// ProductCard: Displays product details in a responsive MUI card with add-to-cart functionality, stock status, and error feedback.
// Props:
//   - product: Product object (see API schema)
//   - onAddToCart: function(productId, quantity)
import React from 'react';
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
} from '@mui/material';
import { AddShoppingCart, Inventory } from '@mui/icons-material';

const formatCurrency = price =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = (event) => {
    // Prevent navigation if the click originated from the add-to-cart button
    if (event.target.closest('.add-to-cart-btn')) return;
    if (product?.id) {
      navigate(`/products/${product.id}`);
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (onAddToCart && product?.id) {
      onAddToCart(product.id, 1);
    }
  };

  const hasStock = product?.stock > 0;
  const productName = product?.name || 'Unnamed Product';
  const productDesc = product?.description || '';
  const productPrice = product?.price ?? 0;

  const productImage =
    product?.images?.[0] ||
    product?.image ||
    product?.imageUrl ||
    'https://via.placeholder.com/300x200?text=No+Image';

  const categoryName =
    typeof product?.category === 'string'
      ? product.category
      : product?.category?.name || 'Uncategorized';

  return (
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
        <CardMedia
          component="img"
          height={180}
          image={productImage}
          alt={`Image of ${productName} (${categoryName})`}
          sx={{ objectFit: 'cover' }}
        />
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
            WebkitLineClamp: 2,   // فقط 2 خط متن
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
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={!hasStock}
          aria-label="Add to cart"
          fullWidth
          sx={{ maxWidth: '100%', fontWeight: 'bold', fontSize: '1rem' }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
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
