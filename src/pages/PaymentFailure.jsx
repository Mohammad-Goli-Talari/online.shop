import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PaymentService from '../services/paymentService';

function PaymentFailure() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const callback = PaymentService.getPaymentCallback();
    
    if (callback && callback.status === 'failed') {
      setPaymentData(callback);
      
      PaymentService.clearPaymentCallback();
    } else if (callback) {
      if (callback.status === 'success') {
        navigate('/payment-success', { replace: true });
        return;
      }
    }
    
    setLoading(false);
  }, [navigate]);

  const handleRetryPayment = () => {
    navigate('/', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleContactSupport = () => {
    window.open('mailto:support@securebank.com', '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Processing payment information...</Typography>
        </Box>
      </Container>
    );
  }

  if (!paymentData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              No payment information found. You may have reached this page directly.
            </Alert>
            <Button 
              variant="contained" 
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {/* Error Icon and Title */}
          <ErrorIcon 
            sx={{ 
              fontSize: 80, 
              color: 'error.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom color="error.main">
            Payment Failed
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We're sorry, but your payment could not be processed. This may be due to insufficient funds, 
            expired card information, or a temporary issue with the payment system.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Payment Details */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {paymentData.orderId}
                </Typography>
              </Box>
            </Grid>
            
            {paymentData.transactionId && (
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Reference ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {paymentData.transactionId}
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {paymentData.timestamp && (
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Attempted On
                  </Typography>
                  <Typography variant="body1">
                    {paymentData.timestamp.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Status Chip */}
          <Chip 
            icon={<ErrorIcon />}
            label="Payment Declined" 
            color="error" 
            variant="outlined"
            sx={{ mb: 4 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<RefreshIcon />}
              onClick={handleRetryPayment}
              color="primary"
            >
              Try Again
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go to Home
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<SupportIcon />}
              onClick={handleContactSupport}
              color="secondary"
            >
              Contact Support
            </Button>
          </Box>

          {/* Troubleshooting Information */}
          <Alert severity="info" sx={{ textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Common solutions:</strong><br />
              • Check that your card information is correct and up to date<br />
              • Ensure you have sufficient funds available<br />
              • Try using a different payment method<br />
              • Contact your bank if the problem persists<br />
              • Your items remain in your cart and you can try again
            </Typography>
          </Alert>

          {/* Support Information */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Need help?</strong> Contact our support team at{' '}
              <a href="mailto:support@securebank.com">support@securebank.com</a> or{' '}
              <a href="tel:+1-800-SECURE-1">+1-800-SECURE-1</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentFailure;