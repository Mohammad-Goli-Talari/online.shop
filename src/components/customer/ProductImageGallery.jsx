// src/components/customer/ProductImageGallery.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Dialog,
  DialogContent
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSwipeable } from 'react-swipeable';

export const ProductImageGallery = ({
  images = [],
  productName = 'Product',
  loading = false
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openZoom, setOpenZoom] = useState(false);

  const hasImages = images && images.length > 0;
  const mainImage = hasImages
    ? images[selectedIndex]
    : 'https://via.placeholder.com/600x600?text=No+Image';

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true
  });

  const handleOpenZoom = (index) => {
    setSelectedIndex(index);
    setOpenZoom(true);
  };

  const handleCloseZoom = () => setOpenZoom(false);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Stack spacing={1}>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Stack direction="row" spacing={1}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={80} height={80} />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Box>
      {/* Original image */}
      <Box sx={{ position: 'relative' }}>
        <Card sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            src={mainImage}
            alt={productName}
            loading="lazy"
            sx={{
              width: '100%',
              height: { xs: 300, sm: 400 },
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: { sm: 'scale(1.05)' } }
            }}
          />
        </Card>
        <IconButton
          onClick={() => handleOpenZoom(selectedIndex)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'background.default' }
          }}
          aria-label="Zoom image"
        >
          <ZoomInIcon />
        </IconButton>
      </Box>

      {/* Thumbnails */}
      <Grid container spacing={1}>
        {hasImages &&
          images.map((img, idx) => (
            <Grid item key={idx}>
              <Card
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View ${productName} image ${idx + 1}`}
                sx={{
                  cursor: 'pointer',
                  border:
                    idx === selectedIndex
                      ? '2px solid'
                      : '2px solid transparent',
                  borderColor:
                    idx === selectedIndex ? 'primary.main' : 'transparent',
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: 70,
                  height: 70
                }}
              >
                <CardMedia
                  component="img"
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Zoom Modal */}
      <Dialog
        open={openZoom}
        onClose={handleCloseZoom}
        maxWidth="lg"
        fullWidth
        aria-labelledby="zoom-dialog-title"
      >
        <DialogContent
          sx={{ p: 1, position: 'relative', textAlign: 'center' }}
          {...swipeHandlers}
        >
          {/* Close button */}
          <IconButton
            onClick={handleCloseZoom}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
            aria-label="Close zoom modal"
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
                aria-label="Previous image"
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
                aria-label="Next image"
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}

          {/* Main zoomed image */}
          <img
            src={mainImage}
            alt={`${productName} zoomed`}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductImageGallery;
