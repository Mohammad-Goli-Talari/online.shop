import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Box } from '@mui/material';

const CategoryChipSkeleton = ({ count = 5, sx = {} }) => {
  const chipWidths = [60, 80, 70, 90, 75];
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        overflowX: { xs: 'scroll', sm: 'auto' },
        py: 1,
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        ...sx,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={`category-chip-skeleton-${index}`}
          variant="rounded"
          width={chipWidths[index % chipWidths.length]}
          height={32}
          sx={{
            borderRadius: '16px',
            flexShrink: 0,
          }}
        />
      ))}
    </Box>
  );
};

CategoryChipSkeleton.propTypes = {
  count: PropTypes.number,
  sx: PropTypes.object,
};

export default CategoryChipSkeleton;