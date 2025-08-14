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

const isNumericString = (v) => typeof v === 'string' && /^\d+$/.test(v);
const coerceId = (v) => (isNumericString(v) ? Number(v) : v);

const normalizeCategories = (arr = []) =>
  arr
    .map((cat) => {
      const rawId = cat?.id ?? cat?._id ?? cat?.categoryId ?? cat?.value ?? null;
      return {
        id: coerceId(rawId),
        name: cat?.name ?? cat?.title ?? cat?.label ?? 'Unnamed Category',
      };
    })
    .filter((c) => c.id !== null && c.id !== undefined);

const CategoryFilter = ({ onCategorySelect, categories: categoriesProp }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // If parent provided categories, use them and skip fetching
        if (Array.isArray(categoriesProp) && categoriesProp.length > 0) {
          if (!isMounted) return;
          setCategories(normalizeCategories(categoriesProp));
          return;
        }

        // Fallback: fetch from service
        const response = await CategoryService.getCategories();
        if (!isMounted) return;

        let raw = [];
        if (Array.isArray(response)) raw = response;
        else if (Array.isArray(response?.categories)) raw = response.categories;
        else if (Array.isArray(response?.data)) raw = response.data;

        setCategories(normalizeCategories(raw));
      } catch (err) {
        if (!isMounted) return;
        console.error('Category fetch error:', err);
        setError('Failed to load categories.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [categoriesProp]);

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategorySelect(value === 'all' ? null : value);
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
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <Box sx={{ minWidth: 200 }}>
        <select
          value={selectedCategory}
          onChange={handleSelect}
          style={{ width: '100%', padding: '8px', fontSize: '1rem' }}
          aria-label="Category filter dropdown"
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </Box>
    </Box>
  );
};

CategoryFilter.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  categories: PropTypes.array, // optional: when provided, no fetching will occur
};

export default CategoryFilter;
