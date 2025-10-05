import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Close,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Assessment,
  Person,
  LocationOn,
  Payment,
} from '@mui/icons-material';
import { getProductImage } from '../../utils/fallbackImages.js';

const OrderDetailModal = ({ open, order, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [error, setError] = useState('');

  const statusConfig = {
    PENDING: { color: 'warning', icon: <Pending />, label: 'Pending' },
    CONFIRMED: { color: 'info', icon: <CheckCircle />, label: 'Confirmed' },
    PROCESSING: { color: 'primary', icon: <Assessment />, label: 'Processing' },
    SHIPPED: { color: 'secondary', icon: <LocalShipping />, label: 'Shipped' },
    DELIVERED: { color: 'success', icon: <CheckCircle />, label: 'Delivered' },
    CANCELLED: { color: 'error', icon: <Cancel />, label: 'Cancelled' }
  };

  const statusTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: []
  };

  React.useEffect(() => {
    if (open) {
      setNewStatus('');
      setStatusNotes('');
      setError('');
    }
  }, [open]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
    } catch {
      return '-';
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;

    setUpdating(true);
    setError('');

    try {
      await onStatusUpdate(order.id, newStatus, statusNotes);
      setNewStatus('');
      setStatusNotes('');
      // Don't close modal to allow further updates
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return null;

  const availableStatuses = statusTransitions[order.status] || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Order Details - #{order.orderNo || order.id}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Order Overview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment /> Order Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Order Number:</Typography>
                  <Typography variant="body2" fontFamily="monospace">#{order.orderNo || order.id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    icon={statusConfig[order.status]?.icon}
                    label={statusConfig[order.status]?.label || order.status}
                    color={statusConfig[order.status]?.color || 'default'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                  <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Last Updated:</Typography>
                  <Typography variant="body2">{formatDate(order.updatedAt)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatCurrency(order.total)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Customer Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body2">{order.user?.fullName || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2">{order.user?.email || `User ${order.userId}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Customer ID:</Typography>
                  <Typography variant="body2" fontFamily="monospace">#{order.userId}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn /> Shipping Address
                </Typography>
                <Typography variant="body2">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.company && (
                    <>
                      {order.shippingAddress.company}
                      <br />
                    </>
                  )}
                  {order.shippingAddress.addressLine1}
                  <br />
                  {order.shippingAddress.addressLine2 && (
                    <>
                      {order.shippingAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                  {order.shippingAddress.phoneNumber && (
                    <>
                      <br />
                      Phone: {order.shippingAddress.phoneNumber}
                    </>
                  )}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Payment Information */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment /> Payment Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Method:</Typography>
                  <Typography variant="body2">
                    {order.paymentMethod?.type || 'N/A'}
                    {order.paymentMethod?.last4 && ` ****${order.paymentMethod.last4}`}
                  </Typography>
                </Box>
                {order.payment && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                      <Typography variant="body2" fontFamily="monospace">
                        {order.payment.transactionId || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Payment Status:</Typography>
                      <Typography variant="body2">{order.payment.status || 'N/A'}</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items ({order.items?.length || 0})
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img
                            src={getProductImage(
                              item.product?.images?.[0] || item.product?.image,
                              item.product?.category,
                              item.product?.id,
                              40,
                              40
                            )}
                            alt={item.product?.name || 'Product'}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 4
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {item.product?.name || 'Unknown Product'}
                            </Typography>
                            {item.product?.category && (
                              <Typography variant="caption" color="text.secondary">
                                {typeof item.product.category === 'string' 
                                  ? item.product.category 
                                  : item.product.category.name}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {item.product?.sku || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatCurrency(item.unitPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{item.quantity}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Status Update Section */}
          {availableStatuses.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Update Order Status
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="New Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {availableStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {statusConfig[status].icon}
                          {statusConfig[status].label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Notes (optional)"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ flexGrow: 1 }}
                  placeholder="Add notes about this status change..."
                />

                <Button
                  variant="contained"
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || updating}
                  sx={{ minWidth: 100 }}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;