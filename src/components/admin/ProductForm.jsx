// src/components/admin/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { object, string, number } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = object({
  name: string().required('Product name is required'),
  description: string().required('Description is required'),
  price: number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  category: string().required('Category is required'),
  image: string().required('Image is required'),
  sku: string(),
});

const mockCategories = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Books' },
  { id: 'cat3', name: 'Clothing' },
];

const ProductForm = ({
  onSubmit,
  loadingSubmit,
  errorApi,
  defaultValues = {
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    sku: '',
  },
  onCancel,
  setIsDirty,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (setIsDirty) {
      setIsDirty(isDirty);
    }
  }, [isDirty, setIsDirty]);

  const [imagePreview, setImagePreview] = useState(defaultValues.image || '');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('image', reader.result, { shouldValidate: true });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const internalSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(internalSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="Product Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                label="Price"
                type="number"
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Category"
                fullWidth
                error={!!errors.category}
                helperText={errors.category?.message}
                {...field}
              >
                {mockCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <TextField
                label="SKU (optional)"
                fullWidth
                error={!!errors.sku}
                helperText={errors.sku?.message}
                {...field}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <Typography variant="body2">Upload Image</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ cursor: 'pointer' }}
            />
            {errors.image && (
              <Typography color="error" variant="caption">
                {errors.image.message}
              </Typography>
            )}
          </Stack>
          {imagePreview && (
            <Box mt={1} sx={{ maxHeight: 150, maxWidth: '100%', overflow: 'hidden' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }}
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} mt={2}>
          {errorApi && <Alert severity="error" sx={{ mb: 2 }}>{errorApi}</Alert>}
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loadingSubmit}
              startIcon={loadingSubmit ? <CircularProgress size={20} /> : null}
            >
              {loadingSubmit ? 'Submitting...' : 'Add Product'}
            </Button>
            <Button variant="outlined" onClick={onCancel} disabled={loadingSubmit}>
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;
