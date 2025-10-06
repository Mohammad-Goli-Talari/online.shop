import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Alert, Chip } from '@mui/material';
import CategoryService from '../../services/categoryService';
import { CategoryChipSkeleton } from '../skeletons';
import { useTranslation } from '../../hooks/useTranslation.js';

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
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (Array.isArray(categoriesProp) && categoriesProp.length > 0) {
          if (!isMounted) return;
          setCategories(normalizeCategories(categoriesProp));
          return;
        }

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
    return () => { isMounted = false; };
  }, [categoriesProp]);

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId ?? null);
    onCategorySelect(categoryId ?? null);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <CategoryChipSkeleton count={6} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <Box
        aria-label={t('ui.productCategories')}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          overflowX: { xs: 'scroll', sm: 'auto' },
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <Chip
          label={t('ui.all')}
          clickable
          color={selectedCategory === null ? 'primary' : 'default'}
          onClick={() => handleSelect(null)}
        />
        {categories.map(category => (
          <Chip
            key={category.id}
            label={category.name}
            clickable
            color={selectedCategory === category.id ? 'primary' : 'default'}
            onClick={() => handleSelect(category.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

CategoryFilter.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  categories: PropTypes.array,
};

export default CategoryFilter;