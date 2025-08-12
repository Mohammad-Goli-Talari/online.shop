// src/components/customer/CategoryFilter.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import CategoryService from '../../services/categoryService';

const CategoryFilter = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await CategoryService.getCategories();
        if (!isMounted) return;

        const categoriesData = Array.isArray(response) ? response : response?.items || [];
        setCategories(categoriesData);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load categories.');
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => { isMounted = false; };
  }, []);

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4} role="status" aria-live="polite" aria-busy="true">
        <CircularProgress aria-label="Loading categories" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" role="alert" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Categories</Typography>
      <List aria-label="Category filter">
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedCategory === null}
            onClick={() => handleSelect(null)}
            aria-pressed={selectedCategory === null}
          >
            <ListItemText primary="All" />
          </ListItemButton>
        </ListItem>
        {categories.map(category => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={selectedCategory === category.id}
              onClick={() => handleSelect(category.id)}
              aria-pressed={selectedCategory === category.id}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

CategoryFilter.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
