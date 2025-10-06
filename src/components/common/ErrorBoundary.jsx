import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            p: 3,
            textAlign: 'center'
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom color="error">
            Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
            We're sorry, but something unexpected happened. This might be related to the language configuration.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="body2">
              If this error persists, try refreshing the page or clearing your browser's localStorage.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleReload}
            sx={{ mb: 2 }}
          >
            Reload Page
          </Button>

          {this.state.error && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                maxWidth: '100%',
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Error Details (Development Mode):
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
