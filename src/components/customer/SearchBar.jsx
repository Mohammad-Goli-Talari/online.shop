// src/components/customer/SearchBar.jsx
// SearchBar: Product search input with debounce, clear, and accessibility features.
// Props:
//   - onSearch: function(query)
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== '') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query.trim());
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search products..."
      aria-label="Search products"
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      inputProps={{
        'aria-label': 'Search products',
        autoComplete: 'off',
        maxLength: 100,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() => onSearch(query.trim())}
              edge="start"
              aria-label="search"
              size="small"
              tabIndex={0}
            >
              <Search />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              aria-label="clear search"
              size="small"
              edge="end"
              tabIndex={0}
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
        sx: { borderRadius: '25px' }
      }}
    />
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
