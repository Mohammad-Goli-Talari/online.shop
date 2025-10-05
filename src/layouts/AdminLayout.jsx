import React, { useState } from 'react';
import { Box, CssBaseline, useMediaQuery, createTheme, ThemeProvider } from '@mui/material';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

const AdminLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant={isMobile ? 'temporary' : 'permanent'}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Topbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleTheme={() => setDarkMode(!darkMode)}
          />
          <Box component="main" sx={{ p: 3, mt: 8 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
