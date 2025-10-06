import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!product) return;

    const categories = [];
    if (product.category) {
      let current = product.category;
      while (current) {
        categories.unshift(current);
        current = current.parent || null;
      }
    }

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

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    script.id = 'breadcrumb-schema';
    
    const existingScript = document.getElementById('breadcrumb-schema');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [product]);

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
    let current = product.category;
    while (current) {
      categories.unshift(current);
      current = current.parent || null;
    }
  }

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
