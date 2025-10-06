import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { Inventory2Outlined as DefaultIcon } from '@mui/icons-material';

const EmptyState = ({ 
  icon: IconComponent,
  title = 'No items found',
  description,
  variant = 'default',
  sx = {},
  ...otherProps
}) => {
  const isCompact = variant === 'compact';
  const DisplayIcon = IconComponent || DefaultIcon;
  
  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: isCompact ? 4 : 8, 
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isCompact ? 200 : 300,
        ...sx
      }}
      {...otherProps}
    >
      <Box 
        sx={{ 
          mb: isCompact ? 2 : 3,
          p: isCompact ? 2 : 3,
          borderRadius: '50%',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DisplayIcon 
          sx={{ 
            fontSize: isCompact ? 48 : 64, 
            color: 'grey.400' 
          }} 
        />
      </Box>
      <Typography 
        variant={isCompact ? 'body1' : 'h6'}
        color="text.secondary" 
        sx={{ 
          mb: description ? 1 : 0, 
          fontWeight: 500 
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 400, 
            lineHeight: 1.6,
            textAlign: 'center'
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact']),
  sx: PropTypes.object,
};

export default EmptyState;