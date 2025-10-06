import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  Language as LanguageIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation.js';
import { useLanguage } from '../../hooks/useLanguage.js';

const MultiLanguageDemo = () => {
  const { t, formatCurrency, formatDate, formatNumber } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();

  const sampleData = {
    product: {
      name: 'Sample Product',
      price: 99.99,
      rating: 4.5,
      reviews: 128,
      stock: 50,
      dateAdded: new Date('2024-01-15')
    },
    order: {
      id: 'ORD-12345',
      total: 299.97,
      items: 3,
      date: new Date('2024-01-20')
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        🌍 {t('navigation.language')} Demo
      </Typography>

      <Grid container spacing={3}>
        {/* Language Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{t('navigation.language')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`${t('languages.english')} (${currentLanguage})`} 
                  color={currentLanguage === 'en' ? 'primary' : 'default'}
                />
                <Chip 
                  label={`RTL: ${isRTL ? 'Yes' : 'No'}`} 
                  color={isRTL ? 'secondary' : 'default'}
                />
                <Chip 
                  label={`Direction: ${isRTL ? 'Right-to-Left' : 'Left-to-Right'}`} 
                  color="default"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Current language: {currentLanguage} | RTL: {isRTL.toString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* E-commerce Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{t('product.title')}</Typography>
              </Box>
              
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('product.productDetail')}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatCurrency(sampleData.product.price)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ color: 'warning.main', mr: 0.5, fontSize: '1rem' }} />
                  <Typography variant="body2">
                    {formatNumber(sampleData.product.rating)} ({formatNumber(sampleData.product.reviews)} {t('product.reviews')})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('product.inStock')}: {formatNumber(sampleData.product.stock)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('order.orderDate')}: {formatDate(sampleData.product.dateAdded)}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<ShoppingCartIcon />}>
                  {t('product.addToCart')}
                </Button>
                <Button variant="outlined" startIcon={<PaymentIcon />}>
                  {t('product.buyNow')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{t('order.title')}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>{t('order.orderNumber')}:</strong> {sampleData.order.id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>{t('order.orderDate')}:</strong> {formatDate(sampleData.order.date)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>{t('order.orderTotal')}:</strong> {formatCurrency(sampleData.order.total)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>{t('common.quantity')}:</strong> {formatNumber(sampleData.order.items)} {t('cart.items')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" startIcon={<ShippingIcon />}>
                  {t('order.trackingNumber')}
                </Button>
                <Button variant="outlined">
                  {t('order.orderDetails')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Messages Demo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('messages.welcome')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="body2">
                    ✅ {t('messages.successMessage')}
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2">
                    ❌ {t('messages.errorOccurred')}
                  </Typography>
                </Paper>
                
                <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                  <Typography variant="body2">
                    ⚠️ {t('messages.validationError')}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Language Features */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🌐 Language Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="primary">
                Currency Formatting
              </Typography>
              <Typography variant="body2">
                {formatCurrency(1234.56)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="primary">
                Date Formatting
              </Typography>
              <Typography variant="body2">
                {formatDate(new Date())}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="primary">
                Number Formatting
              </Typography>
              <Typography variant="body2">
                {formatNumber(1234567.89)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="primary">
                RTL Support
              </Typography>
              <Typography variant="body2">
                {isRTL ? '✅ Enabled' : '❌ Disabled'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MultiLanguageDemo;
