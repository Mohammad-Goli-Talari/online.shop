import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Skeleton,
  Rating,
  Avatar,
  Stack,
  Paper,
} from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const ProductReviews = ({
  productId,
  isLoading = false,
  reviews = null,
  averageRating = null,
  reviewCount = null,
  onWriteReview = null,
}) => {

  const schemaMarkup = useMemo(() => {
    return averageRating !== null && reviewCount !== null
      ? {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          '@id': `/products/${productId}`,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            bestRating: 5,
            worstRating: 1,
            reviewCount: reviewCount,
          },
        }
      : null;
  }, [averageRating, reviewCount, productId]);

  useEffect(() => {
    if (schemaMarkup) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schemaMarkup);
      script.id = 'product-reviews-schema';
      
      const existingScript = document.getElementById('product-reviews-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById('product-reviews-schema');
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      };
    }
  }, [schemaMarkup]);

  return (
    <Box
      mt={6}
      component="section"
      id="product-reviews"
      aria-labelledby="product-reviews-heading"
    >
      <Divider sx={{ mb: 4 }} />
      <Typography
        id="product-reviews-heading"
        variant="h5"
        component="h2"
        gutterBottom
        fontWeight="bold"
      >
        Customer Reviews
      </Typography>

      {/* Loading state */}
      {isLoading && (
        <Stack spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Box key={i} display="flex" gap={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box flex={1}>
                <Skeleton width="30%" />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {/* Placeholder when there is no review */}
      {!isLoading && (!reviews || reviews.length === 0) && (
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'grey.400',
            borderRadius: 2,
            color: 'text.secondary',
            bgcolor: 'background.paper',
          }}
        >
          <RateReviewOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Reviews for product ID <strong>{productId}</strong> are not
            available yet.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Be the first to share your opinion once this feature is enabled!
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={onWriteReview || (() => {})}
            disabled={!onWriteReview}
            sx={{ textTransform: 'none' }}
          >
            Write a Review
          </Button>
        </Box>
      )}

      {/* Show reviews */}
      {!isLoading && reviews && reviews.length > 0 && (
        <Stack spacing={3} mt={2}>
          {averageRating !== null && reviewCount !== null && (
            <Box display="flex" alignItems="center" gap={1}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {averageRating.toFixed(1)} / 5 ({reviewCount} reviews)
              </Typography>
            </Box>
          )}

          {reviews.map((review) => (
            <Paper key={review.id} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar>{review.author[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2">{review.author}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.date).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ProductReviews;
