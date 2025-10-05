import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Visibility,
  MoreVert,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Assessment,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import EmptyState from '../common/EmptyState';

const OrderTable = ({
  orders,
  loading,
  hasMore,
  onLoadMore,
  onViewOrder,
  onStatusUpdate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tableRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [statusMenus, setStatusMenus] = useState({});

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

  const handleScroll = useCallback(async () => {
    if (!tableRef.current || !hasMore || loading || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8) {
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, loading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const currentRef = tableRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [handleScroll]);

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
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '-';
    }
  };

  const handleStatusMenuOpen = (event, orderId) => {
    setStatusMenus(prev => ({
      ...prev,
      [orderId]: event.currentTarget
    }));
  };

  const handleStatusMenuClose = (orderId) => {
    setStatusMenus(prev => ({
      ...prev,
      [orderId]: null
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await onStatusUpdate(orderId, newStatus);
      handleStatusMenuClose(orderId);
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const getStatusChip = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <Paper sx={{ overflow: 'hidden' }}>
        <EmptyState 
          icon={ReceiptIcon}
          title="No orders found"
          description="Orders will appear here when customers place them."
          variant="default"
        />
      </Paper>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <TableContainer
        component={Paper}
        ref={tableRef}
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <Table size={isMobile ? 'small' : 'medium'} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                    #{order.orderNo || order.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {order.user?.fullName || order.user?.email || `User ${order.userId}`}
                    </Typography>
                    {order.user?.email && (
                      <Typography variant="caption" color="text.secondary">
                        {order.user.email}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(order.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.items?.length || order.itemCount || 0} item{(order.items?.length || order.itemCount || 0) !== 1 ? 's' : ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(order.total)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {getStatusChip(order.status)}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => onViewOrder(order)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    
                    {statusTransitions[order.status]?.length > 0 && (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => handleStatusMenuOpen(e, order.id)}
                          title="Change Status"
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={statusMenus[order.id]}
                          open={Boolean(statusMenus[order.id])}
                          onClose={() => handleStatusMenuClose(order.id)}
                        >
                          {statusTransitions[order.status].map((status) => (
                            <MenuItem
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                            >
                              {statusConfig[status].icon}
                              <Box ml={1}>{statusConfig[status].label}</Box>
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Loading more indicator */}
            {(loading || isLoadingMore) && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      {isLoadingMore ? 'Loading more orders...' : 'Loading orders...'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            
            {/* No more data indicator */}
            {!loading && !isLoadingMore && !hasMore && orders.length > 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No more orders to load
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderTable;