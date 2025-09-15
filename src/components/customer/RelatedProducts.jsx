// src/components/customer/RelatedProducts.jsx
import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Related Products</Typography>
      <Grid container spacing={2}>
        {products.map(p => (
          <Grid item xs={6} md={3} key={p.id}>
            <Card>
              <CardActionArea component={Link} to={`/product/${p.id}`}>
                <CardMedia component="img" height="140" image={p.images?.[0]} alt={p.name} />
                <CardContent>
                  <Typography variant="subtitle1">{p.name}</Typography>
                  <Typography variant="body2" color="text.secondary">${p.price.toFixed(2)}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProducts;
