import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const Topbar = ({ onToggleSidebar, onToggleTheme }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Tooltip title="Toggle dark mode">
          <IconButton color="inherit" onClick={onToggleTheme}>
            <Brightness4Icon />
          </IconButton>
        </Tooltip>
        <Avatar alt="Admin" sx={{ mx: 2 }} />
        <IconButton color="inherit">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
