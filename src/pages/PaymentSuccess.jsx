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
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PaymentService from '../services/paymentService';
import OrderService from '../services/orderService';
import { useCart } from '../context/useCart';

function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirmationError, setOrderConfirmationError] = useState(null);

  useEffect(() => {
    const callback = PaymentService.getPaymentCallback();
    
    if (callback && callback.status === 'success') {
      setPaymentData(callback);
      
      confirmOrder(callback);
      
      clearCart().catch(error => {
        console.error('Failed to clear cart after payment:', error);
      });
      
      PaymentService.clearPaymentCallback();
    } else if (callback) {
      if (callback.status === 'failed') {
        navigate('/payment-failure', { replace: true });
        return;
      } else if (callback.status === 'cancelled') {
        navigate('/payment-cancelled', { replace: true });
        return;
      }
    }
    
    setLoading(false);
  }, [navigate, clearCart]);

  const confirmOrder = async (paymentCallback) => {
    try {
      console.log('🔄 Confirming order after successful payment:', paymentCallback.orderId);
      
      await OrderService.confirmOrderByOrderNumber(paymentCallback.orderId, {
        transactionId: paymentCallback.transactionId,
        timestamp: paymentCallback.timestamp
      });
      
      console.log('✅ Order confirmed successfully');
      
    } catch (error) {
      console.error('❌ Failed to confirm order:', error);
      setOrderConfirmationError(error.message);
      // Don't break the user experience - they still see success page
    }
  };

  const handleContinueShopping = () => {
    navigate('/', { replace: true });
  };

  const handleViewOrders = () => {
    navigate('/orders', { replace: true });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Processing payment confirmation...</Typography>
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
              onClick={handleContinueShopping}
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
          {/* Success Icon and Title */}
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: 'success.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Thank you for your purchase. Your payment has been processed successfully.
          </Typography>

          {/* Order Confirmation Error (if any) */}
          {orderConfirmationError && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Payment Successful</strong> - Your payment was processed, but there was an issue updating your order status. 
                Please contact support with your order ID: <strong>{paymentData.orderId}</strong>
              </Typography>
            </Alert>
          )}

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
                    Transaction ID
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
                    Payment Date
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
            icon={<ReceiptIcon />}
            label="Payment Confirmed" 
            color="success" 
            variant="outlined"
            sx={{ mb: 4 }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={handleViewOrders}
            >
              View Orders
            </Button>
          </Box>

          {/* Additional Information */}
          <Alert severity="info" sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>What happens next?</strong><br />
              • You will receive an email confirmation shortly<br />
              • Your order will be processed and prepared for shipping<br />
              • You can track your order status in the Orders section
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
}

export default PaymentSuccess;