import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { title: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
  { title: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { title: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
  { title: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

const Sidebar = ({ open, onClose, variant }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if the current path matches or is a child of the menu item path
  const isActivePath = (menuPath) => {
    if (menuPath === '/admin') {
      // For dashboard, only match exact path
      return location.pathname === '/admin';
    }
    // For other paths, match if current path starts with the menu path
    return location.pathname.startsWith(menuPath);
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <ListItemButton 
                key={item.title} 
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRight: '3px solid',
                    borderRightColor: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                  '&:hover:not(.Mui-selected)': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
