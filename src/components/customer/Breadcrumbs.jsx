// src/components/customer/Breadcrumbs.jsx
import React from 'react';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Skeleton,
  Box,
} from '@mui/material';
import { Home, ChevronRight } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs = ({ product, loading }) => {
  if (loading) {
    return (
      <Skeleton
        variant="text"
        width={250}
        height={28}
        sx={{ mb: { xs: 1.5, md: 2 } }}
      />
    );
  }

  if (!product) return null;

  return (
    <Box component="nav" aria-label="breadcrumb">
      <MUIBreadcrumbs
        separator={<ChevronRight fontSize="small" />}
        sx={{ mb: { xs: 2, md: 3 } }}
      >
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>

        {product?.category && (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={`/categories/${product?.category?.slug || ''}`}
          >
            {product?.category?.name || '...'}
          </Link>
        )}

        <Typography
          color="text.primary"
          aria-current="page"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: { xs: '120px', sm: '200px', md: '300px' },
          }}
        >
          {product?.name || '...'}
        </Typography>
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
