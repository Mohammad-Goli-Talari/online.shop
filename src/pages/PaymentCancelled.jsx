import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import {
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PaymentService from '../services/paymentService';

function PaymentCancelled() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const callback = PaymentService.getPaymentCallback();
    
    if (callback) {
      setPaymentData(callback);
      PaymentService.clearPaymentCallback();
    }
    
    setLoading(false);
  }, []);

  const handleReturnToCart = () => {
    navigate('/', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {/* Cancel Icon and Title */}
          <CancelIcon 
            sx={{ 
              fontSize: 80, 
              color: 'warning.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom color="warning.main">
            Payment Cancelled
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You have cancelled the payment process. No charges were made to your account.
            Your items are still in your cart and you can complete your purchase at any time.
          </Typography>

          {/* Status Chip */}
          <Chip 
            icon={<CancelIcon />}
            label="Payment Cancelled" 
            color="warning" 
            variant="outlined"
            sx={{ mb: 4 }}
          />

          {paymentData?.orderId && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Order Reference
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {paymentData.orderId}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleReturnToCart}
              color="primary"
            >
              Return to Cart
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Continue Shopping
            </Button>
          </Box>

          {/* Information */}
          <Alert severity="info" sx={{ textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>What happened?</strong><br />
              • You chose to cancel the payment process<br />
              • No payment was processed<br />
              • Your cart items are preserved<br />
              • You can complete your purchase whenever you're ready
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentCancelled;