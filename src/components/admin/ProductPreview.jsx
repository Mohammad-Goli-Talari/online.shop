import React from 'react';
import {
  Box, Typography, Card, CardContent, CardMedia, Grid, Chip, ImageList, ImageListItem,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const ProductPreview = ({ formData, images = [], categoryName = 'N/A' }) => {
  const primaryImage = images.length > 0 ? images[0].preview : 'https://via.placeholder.com/600x400.png?text=No+Image';

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Product Preview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={primaryImage}
              alt="Primary product image"
              sx={{ borderRadius: 2, maxHeight: 300, objectFit: 'cover' }}
            />
            {images.length > 1 && (
              <ImageList sx={{ width: '100%', mt: 1 }} cols={4} rowHeight={80}>
                {images.slice(1).map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image.preview} alt={`preview ${index}`} loading="lazy" style={{ borderRadius: '4px', height: '100%', objectFit: 'cover' }} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {formData.name || 'Product Name'}
            </Typography>
            <Box display="flex" alignItems="center" my={1} gap={2}>
              <Chip label={categoryName} color="primary" variant="outlined" />
              <Typography variant="body2" color="text.secondary">
                SKU: {formData.sku || 'SKU-123'}
              </Typography>
            </Box>
            <Typography variant="h5" color="primary.main" fontWeight={500} my={2}>
              ${parseFloat(formData.price || 0).toFixed(2)}
            </Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {formData.description || 'No description provided.'}
              </Typography>
            </Box>
            <Box display="flex" gap={3} mt={3}>
              <Chip
                label={`${formData.stock || 0} in stock`}
                color={formData.stock > 0 ? 'success' : 'error'}
                variant="filled" size="small"
              />
              <Chip
                icon={formData.isActive ? <CheckCircle /> : <Cancel />}
                label={formData.isActive ? 'Active' : 'Inactive'}
                color={formData.isActive ? 'success' : 'default'} size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductPreview;