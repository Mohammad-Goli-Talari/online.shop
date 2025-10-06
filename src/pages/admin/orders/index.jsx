import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FilterList, Refresh } from '@mui/icons-material';
import AdminLayout from '../../../layouts/AdminLayout';
import OrderTable from '../../../components/admin/OrderTable';
import { useTranslation } from '../../../hooks/useTranslation.js';
import OrderDetailModal from '../../../components/admin/OrderDetailModal';
import OrderService from '../../../services/orderService';

const AdminOrdersPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false
  });
  const hasInitialized = useRef(false);

  const [filters, setFilters] = useState({
    status: '',
    dateFrom: null,
    dateTo: null,
    userId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const statusOptions = [
    { value: '', label: t('ui.allStatus') },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: t('ui.processing') },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Order Date' },
    { value: 'total', label: 'Total Amount' },
    { value: 'status', label: 'Status' },
    { value: 'orderNo', label: 'Order Number' }
  ];

  const loadOrders = useCallback(async (page = 1, newFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const options = {
        page,
        limit: 10,
        ...newFilters,
        dateFrom: newFilters.dateFrom ? newFilters.dateFrom.toISOString().split('T')[0] : undefined,
        dateTo: newFilters.dateTo ? newFilters.dateTo.toISOString().split('T')[0] : undefined,
        userId: newFilters.userId || undefined
      };

      Object.keys(options).forEach(key => {
        if (options[key] === '' || options[key] === null || options[key] === undefined) {
          delete options[key];
        }
      });

      const response = await OrderService.getAllOrders(options);
      const { orders: orderList, pagination: paginationData } = response;

      if (page === 1) {
        setOrders(orderList || []);
      } else {
        setOrders(prev => [...prev, ...(orderList || [])]);
      }

      setPagination({
        page: paginationData?.currentPage || 1,
        totalPages: paginationData?.totalPages || 1,
        totalItems: paginationData?.totalItems || 0,
        hasMore: paginationData?.hasNext || false
      });
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadOrders();
    }
  }, [loadOrders]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    loadOrders(1, filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: '',
      dateFrom: null,
      dateTo: null,
      userId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    loadOrders(1, resetFilters);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      loadOrders(pagination.page + 1);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleStatusUpdate = async (orderId, newStatus, notes = '') => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus, notes);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }

      loadOrders(1, filters);
    } catch (err) {
      console.error('Update order status error:', err);
      throw err;
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pagination.totalItems} order{pagination.totalItems !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => loadOrders(1, filters)}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {/* Filters */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom startIcon={<FilterList />}>
{t('ui.filters')}
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="end">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t('ui.status')}</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChange={(date) => handleFilterChange('dateFrom', date)}
                slotProps={{ textField: { size: 'small' } }}
              />

              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChange={(date) => handleFilterChange('dateTo', date)}
                slotProps={{ textField: { size: 'small' } }}
              />

              <TextField
                size="small"
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                sx={{ minWidth: 120 }}
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>{t('ui.sortBy')}</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="Order"
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <MenuItem value="desc">Desc</MenuItem>
                  <MenuItem value="asc">Asc</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                Apply
              </Button>

              <Button
                variant="outlined"
                onClick={handleResetFilters}
                disabled={loading}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </LocalizationProvider>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          loading={loading}
          hasMore={pagination.hasMore}
          onLoadMore={handleLoadMore}
          onViewOrder={handleViewOrder}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          open={openDetailModal}
          order={selectedOrder}
          onClose={() => {
            setOpenDetailModal(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      </Container>
    </AdminLayout>
  );
};

export default AdminOrdersPage;