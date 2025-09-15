// src/components/customer/Breadcrumbs.jsx
import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { Home, ChevronRight } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs = ({ category, productName }) => {
  return (
    <MUIBreadcrumbs
      separator={<ChevronRight fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        <Home fontSize="small" sx={{ mr: 0.5, mb: -0.3 }} /> Home
      </Link>
      {category && (
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to={`/category/${category.slug}`}
        >
          {category.name}
        </Link>
      )}
      <Typography color="text.primary">{productName}</Typography>
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
