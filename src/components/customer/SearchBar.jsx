import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const SearchBar = ({ onSearch = () => Promise.resolve(), minQueryLength = 3, debounceMs = 800 }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    debounceTimerRef.current = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery === '' || trimmedQuery.length >= minQueryLength) {
        setIsSearching(true);
        
        abortControllerRef.current = new AbortController();
        
        onSearch(trimmedQuery, abortControllerRef.current.signal)
          .finally(() => {
            setIsSearching(false);
            abortControllerRef.current = null;
          });
      }
    }, debounceMs);
  }, [onSearch, minQueryLength, debounceMs]);

  const handleInputChange = useCallback((e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsSearching(false);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    onSearch('').catch(() => {});
  }, [onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedQuery = query.trim();
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      if (trimmedQuery === '' || trimmedQuery.length >= minQueryLength) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        setIsSearching(true);
        abortControllerRef.current = new AbortController();
        
        onSearch(trimmedQuery, abortControllerRef.current.signal)
          .finally(() => {
            setIsSearching(false);
            abortControllerRef.current = null;
          });
      }
    }
  }, [query, onSearch, minQueryLength]);

  const handleSearchClick = useCallback(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === '' || trimmedQuery.length >= minQueryLength) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      setIsSearching(true);
      abortControllerRef.current = new AbortController();
      
      onSearch(trimmedQuery, abortControllerRef.current.signal)
        .finally(() => {
          setIsSearching(false);
          abortControllerRef.current = null;
        });
    }
  }, [query, onSearch, minQueryLength]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search products..."
      aria-label="Search products"
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSearching}
      inputProps={{
        'aria-label': 'Search products',
        'aria-describedby': 'search-help',
        autoComplete: 'off',
        maxLength: 100,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={handleSearchClick}
              edge="start"
              aria-label="search"
              size="small"
              tabIndex={0}
              disabled={isSearching || (query.trim() !== '' && query.trim().length < minQueryLength)}
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
              disabled={isSearching}
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
  onSearch: PropTypes.func,
  minQueryLength: PropTypes.number,
  debounceMs: PropTypes.number,
};

export default SearchBar;
