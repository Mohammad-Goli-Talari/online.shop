import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CardMedia, Box } from '@mui/material';
import { getFallbackImageUrl } from '../../utils/fallbackImages.js';

const EnhancedImage = ({
  src,
  alt,
  category = 'generic',
  width = 600,
  height = 400,
  sx = {},
  component = 'img',
  loading = 'lazy',
  ...props
}) => {
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [hasErrored, setHasErrored] = useState(false);
  const [errorAttempts, setErrorAttempts] = useState(0);

  const handleImageError = (e) => {
    if (errorAttempts >= 3 || hasErrored) {
      console.warn('Maximum image load attempts reached');
      setHasErrored(true);
      if (e && e.target) {
        e.target.onError = null;
      }
      return;
    }

    setErrorAttempts(prev => prev + 1);
    
    if (fallbackLevel < 2) {
      setFallbackLevel(prev => prev + 1);
    } else {
      setHasErrored(true);
    }
  };

  const getImageSrc = () => {
    if (hasErrored || errorAttempts >= 3) {
      return `https://placehold.co/${width}x${height}/4F46E5/FFFFFF?text=Product`;
    }
    
    if (fallbackLevel === 0 && src) {
      return src;
    } else if (fallbackLevel === 1) {
      return getFallbackImageUrl(category, 0);
    } else {
      return getFallbackImageUrl('generic', 0);
    }
  };

  const imageSrc = getImageSrc();

  if (component === 'img') {
    return (
      <Box
        component="img"
        src={imageSrc}
        alt={alt}
        loading={loading}
        onError={hasErrored ? undefined : handleImageError}
        sx={{
          objectFit: 'cover',
          ...sx
        }}
        {...props}
      />
    );
  }

  return (
    <CardMedia
      component="img"
      image={imageSrc}
      alt={alt}
      onError={hasErrored ? undefined : handleImageError}
      sx={{
        objectFit: 'cover',
        ...sx
      }}
      {...props}
    />
  );
};

EnhancedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  category: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  sx: PropTypes.object,
  component: PropTypes.string,
  loading: PropTypes.string,
};

export default EnhancedImage;