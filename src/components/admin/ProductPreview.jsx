import React from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, Grid, Chip, ImageList, ImageListItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { getProfessionalFallbackImage } from '../../utils/fallbackImages.js';

const ProductPreview = ({ formData, images = [], categoryName = 'N/A' }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const primaryImage =
    images.length > 0
      ? images[0].preview || images[0].url
      : getProfessionalFallbackImage(categoryName, formData.name, 600, 400);

  const priceValue = Number(formData.price);
  const displayPrice = isNaN(priceValue) ? '0.00' : priceValue.toFixed(2);

  const stockValue = Number(formData.stock);
  const stockIsNumber = !isNaN(stockValue);
  const stockLabel = `${stockIsNumber ? stockValue : 0} in stock`;
  const stockColor = stockIsNumber ? (stockValue > 0 ? 'success' : 'warning') : 'default';

  return (
    <Card variant="outlined" sx={{ maxWidth: '100%' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Product Preview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={primaryImage}
              alt={formData.name || 'Primary product image'}
              sx={{ borderRadius: 2, maxHeight: 300, objectFit: 'cover', width: '100%' }}
            />
            {images.length > 1 && (
              <ImageList sx={{ width: '100%', mt: 1 }} cols={isXs ? 2 : 4} rowHeight={80} gap={8}>
                {images.slice(1).map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image.preview || image.url}
                      alt={(formData.name ? `${formData.name} ` : '') + `preview ${index + 1}`}
                      loading="lazy"
                      style={{ borderRadius: 4, height: '100%', objectFit: 'cover', width: '100%' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
              {formData.name || 'Product Name'}
            </Typography>

            <Box display="flex" alignItems="center" my={1} gap={2} flexWrap="wrap">
              <Chip label={categoryName} color="primary" variant="outlined" />
              <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'text' }}>
                SKU: {formData.sku || 'SKU-123'}
              </Typography>
            </Box>

            <Typography variant="h5" color="primary.main" fontWeight={500} my={2}>
              ${displayPrice}
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {formData.description || 'No description provided.'}
              </Typography>
            </Box>

            <Box display="flex" gap={3} mt={3} flexWrap="wrap">
              <Chip label={stockLabel} color={stockColor} variant="filled" size="small" />
              <Chip
                icon={formData.isActive ? <CheckCircle /> : <Cancel />}
                label={formData.isActive ? 'Active' : 'Inactive'}
                color={formData.isActive ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductPreview;
