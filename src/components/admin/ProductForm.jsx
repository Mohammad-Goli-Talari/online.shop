import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  category: yup.string().required('Category is required'),
  description: yup.string(),
  imageUrl: yup.string().url('Must be a valid URL').nullable(),
});

const ProductForm = ({ onCancel, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      price: '',
      category: '',
      description: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await CategoryService.getCategories();
        if (response && Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          setCategories(response);
        } else {
          setCategories([]);
          console.error('Unexpected categories response format:', response);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoadingSubmit(true);

    try {
      await ProductService.createProduct(data);
      setSuccessMsg('Product created successfully!');
      onSuccess?.();
      reset();
      onCancel?.();
    } catch (error) {
      setErrorMsg(error.message || 'Failed to create product');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Stack spacing={2}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <TextField
          label="Product Name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="SKU"
          fullWidth
          {...register('sku')}
          error={!!errors.sku}
          helperText={errors.sku?.message}
        />

        <TextField
          label="Price"
          type="number"
          fullWidth
          {...register('price')}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        {loadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <TextField
            select
            label="Category"
            fullWidth
            {...register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            {(Array.isArray(categories) ? categories : []).map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          label="Image URL"
          fullWidth
          {...register('imageUrl')}
          error={!!errors.imageUrl}
          helperText={errors.imageUrl?.message}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel} disabled={loadingSubmit}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loadingSubmit}
            startIcon={loadingSubmit && <CircularProgress size={16} />}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductForm;
