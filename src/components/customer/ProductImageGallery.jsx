import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Dialog,
  DialogContent,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSwipeable } from 'react-swipeable';
import { FocusTrap } from '@mui/base';
import { getProfessionalFallbackImage } from '../../utils/fallbackImages.js';

const ProductImageGallery = ({
  images = [],
  productName = 'Product',
  loading = false,
  category = null,
  productId = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openZoom, setOpenZoom] = useState(false);

  const hasImages = images && images.length > 0;
  const mainImage = hasImages
    ? images[selectedIndex]
    : getProfessionalFallbackImage(category, productId, 600, 600);

  const zoomRef = useRef(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });

  const handleOpenZoom = (index) => {
    setSelectedIndex(index);
    setOpenZoom(true);
  };
  const handleCloseZoom = () => setOpenZoom(false);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!openZoom) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') handleCloseZoom();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openZoom, handlePrev, handleNext]);

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
              '&:hover': { transform: { sm: 'scale(1.1)' } },
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
            '&:hover': { bgcolor: 'background.default' },
          }}
          aria-label="Zoom image"
        >
          <ZoomInIcon />
        </IconButton>
      </Box>

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
                  height: 70,
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

      <Dialog
        open={openZoom}
        onClose={handleCloseZoom}
        maxWidth="lg"
        fullWidth
        aria-labelledby="zoom-dialog-title"
      >
        <FocusTrap open={openZoom}>
          <DialogContent
            sx={{ p: 1, position: 'relative', textAlign: 'center' }}
            {...swipeHandlers}
            ref={zoomRef}
          >
            <IconButton
              onClick={handleCloseZoom}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
              aria-label="Close zoom modal"
            >
              <CloseIcon />
            </IconButton>

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
                    '&:hover': { bgcolor: 'background.default' },
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
                    '&:hover': { bgcolor: 'background.default' },
                  }}
                  aria-label="Next image"
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}

            <img
              src={mainImage}
              alt={`${productName} zoomed`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          </DialogContent>
        </FocusTrap>
      </Dialog>
    </Box>
  );
};

export default ProductImageGallery;
