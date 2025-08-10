import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
        if(onSearch) {
           onSearch(query);
        }
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search products..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleSearch}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleSearch} edge="start">
              <Search />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          borderRadius: '25px', // Rounded search bar
        }
      }}
    />
  );
};

export default SearchBar;