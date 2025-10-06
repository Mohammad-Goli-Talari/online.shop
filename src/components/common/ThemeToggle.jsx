import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../../hooks/useThemeMode.js';

const ThemeToggle = ({ size = 'medium', color = 'inherit', sx = {} }) => {
  const { toggleTheme, isDark } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color={color}
        size={size}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          ...sx,
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;