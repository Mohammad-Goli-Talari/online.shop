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
import { Helmet } from 'react-helmet';

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

  const categories = [];
  if (product.category) {
    // parent categories
    let current = product.category;
    while (current) {
      categories.unshift(current);
      current = current.parent || null;
    }
  }
  // JSON-LD structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      ...categories.map((cat, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": cat.name,
        "item": `${window.location.origin}/categories/${cat.slug}`
      })),
      {
        "@type": "ListItem",
        "position": categories.length + 2,
        "name": product.name,
        "item": `${window.location.href}`
      }
    ]
  };

  return (
    <Box component="nav" aria-label="breadcrumb">
      {/* JSON-LD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

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

        {categories.map((cat, idx) => (
          <Link
            key={cat.slug || idx}
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={`/categories/${cat.slug}`}
          >
            {cat.name || '...'}
          </Link>
        ))}

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
          {product.name || '...'}
        </Typography>
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
