// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material',
      '@mantine/core',
      '@mantine/hooks'
    ]
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false
      }
    },
    historyApiFallback: true
  }
});
