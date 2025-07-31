// src/components/admin/AddProductModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductForm from './ProductForm';
import ProductService from '../../services/productService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxWidth: 600,
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AddProductModal = ({ open, onClose, onProductAdded }) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        setErrorApi(null);
        setIsDirty(false);
      }
    } else {
      onClose();
      setErrorApi(null);
      setIsDirty(false);
    }
  };

  const handleSubmit = useCallback(
    async (productData) => {
      setLoadingSubmit(true);
      setErrorApi(null);
      try {
        const newProduct = await ProductService.createProduct(productData);
        onProductAdded(newProduct);
        setIsDirty(false);
        onClose();
      } catch (error) {
        setErrorApi(error.message || 'Failed to add product');
      } finally {
        setLoadingSubmit(false);
      }
    },
    [onProductAdded, onClose]
  );

  useEffect(() => {
    if (open) {
      setErrorApi(null);
      setIsDirty(false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
      aria-labelledby="add-product-modal-title"
      aria-describedby="add-product-modal-description"
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="add-product-modal-title" variant="h6" component="h2" fontWeight={600}>
              Add New Product
            </Typography>
            <IconButton onClick={handleClose} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
          <ProductForm
            onSubmit={handleSubmit}
            loadingSubmit={loadingSubmit}
            errorApi={errorApi}
            onCancel={handleClose}
            setIsDirty={setIsDirty}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddProductModal;
