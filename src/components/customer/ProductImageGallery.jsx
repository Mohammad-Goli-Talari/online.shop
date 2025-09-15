// src/components/customer/ProductImageGallery.jsx
import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ProductImageGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) return <Box>No images</Box>;

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <img src={images[selected]} alt="Product" style={{ width: '100%', borderRadius: 8 }} />
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}><ZoomInIcon /></IconButton>
      </Box>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {images.map((img, idx) => (
          <Grid item key={idx}>
            <img
              src={img}
              alt={`Thumbnail ${idx}`}
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                border: idx === selected ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer'
              }}
              onClick={() => setSelected(idx)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductImageGallery;
