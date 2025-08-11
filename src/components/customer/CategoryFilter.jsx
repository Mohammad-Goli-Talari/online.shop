// src/components/customer/CategoryFilter.jsx
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, CircularProgress, Box, Alert } from '@mui/material';
import CategoryService from '../../services/categoryService';

const CategoryFilter = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getCategories();

        // --- REVISED LOGIC ---
        // The service returns the content of "data" due to handleApiResponse.
        // Check if the response is an array directly.
        // This makes it robust whether the API returns an array or an object like { data: [...] }.
        const categoriesData = Array.isArray(response) ? response : response?.data;
        
        setCategories(categoriesData || []);
        setError(null);
      } catch (err) {
        setError('Failed to load categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={selectedCategory === null} onClick={() => handleSelect(null)}>
            <ListItemText primary="All" />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton selected={selectedCategory === category.id} onClick={() => handleSelect(category.id)}>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryFilter;