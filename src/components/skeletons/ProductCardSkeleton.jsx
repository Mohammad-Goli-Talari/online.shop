import React from 'react';
import PropTypes from 'prop-types';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Skeleton, 
  Box 
} from '@mui/material';

const ProductCardSkeleton = ({ sx = {} }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease-in-out',
        borderRadius: 2,
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          height={180}
          sx={{
            width: '100%',
          }}
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            borderRadius: '12px',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton
          variant="text"
          width="85%"
          height={32}
          sx={{ mb: 1 }}
        />
        
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          sx={{ mb: 0.5 }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          sx={{ mb: 2 }}
        />
        
        <Skeleton
          variant="text"
          width="40%"
          height={28}
          sx={{ 
            mt: 'auto',
            fontWeight: 'bold',
          }}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          sx={{ borderRadius: '12px' }}
        />
        
        <Skeleton
          variant="rounded"
          width={100}
          height={36}
          sx={{ borderRadius: '8px' }}
        />
      </CardActions>
    </Card>
  );
};

ProductCardSkeleton.propTypes = {
  sx: PropTypes.object,
};

export default ProductCardSkeleton;