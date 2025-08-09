// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import { debounce } from 'lodash';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
  sku: yup.string().required('SKU is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  stock: yup
    .number()
    .typeError('Stock must be a number')
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().nullable(),
  images: yup
    .array()
    .of(yup.string().url('Must be a valid URL'))
    .min(1, 'At least one image is required'),
  isActive: yup.boolean(),
});

const ProductForm = ({ onCancel, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successMsgOpen, setSuccessMsgOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      sku: '',
      price: '',
      stock: 0,
      category: '',
      description: '',
      images: [''],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const name = watch('name');
  const sku = watch('sku');
  const images = watch('images');
  const category = watch('category');

  useEffect(() => {
    if (!name || isSkuManuallyEdited) return;

    const generateSku = debounce(() => {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      const newSku = `pro-${slug}-${random}`;
      setValue('sku', newSku, { shouldValidate: true });
    }, 400);

    generateSku();
    return () => generateSku.cancel();
  }, [name, isSkuManuallyEdited, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await CategoryService.getCategories();
        if (response && Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ارسال فرم
  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoadingSubmit(true);
    try {
      const payload = {
        name: data.name,
        sku: data.sku,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        categoryId: parseInt(data.category, 10),
        description: data.description || null,
        images: data.images.filter((url) => url.trim() !== ''),
        isActive: data.isActive,
      };
      await ProductService.createProduct(payload);
      setSuccessMsgOpen(true);
      reset();
      onSuccess?.();
      onCancel?.();
    } catch (error) {
      setErrorMsg(error.message || 'Failed to create product');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setConfirmClose(true);
    } else {
      onCancel?.();
    }
  };

  const handleConfirmClose = () => {
    setConfirmClose(false);
    onCancel?.();
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <Stack spacing={2}>

          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <TextField
            label="Product Name"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            autoComplete="off"
          />

          <TextField
            label="SKU"
            fullWidth
            placeholder="Auto-generated SKU will appear here"
            value={sku || ''}
            {...register('sku')}
            error={!!errors.sku}
            helperText={errors.sku?.message}
            onChange={(e) => {
              setIsSkuManuallyEdited(true);
              setValue('sku', e.target.value);
            }}
            autoComplete="off"
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            {...register('price')}
            error={!!errors.price}
            helperText={errors.price?.message}
            inputProps={{ min: 0, step: '0.01' }}
            autoComplete="off"
          />

          <TextField
            label="Stock"
            type="number"
            fullWidth
            {...register('stock')}
            error={!!errors.stock}
            helperText={errors.stock?.message}
            inputProps={{ min: 0, step: 1 }}
            autoComplete="off"
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
              value={category || ''}
              onChange={(e) => setValue('category', e.target.value, { shouldValidate: true })}
            >
              <MenuItem value="">Select category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>
                  {cat.name}
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
            autoComplete="off"
          />

          {/* Images section */}
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Images
            </Typography>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  {...register(`images.${index}`)}
                  error={!!errors.images?.[index]}
                  helperText={errors.images?.[index]?.message}
                  placeholder="Image URL or upload file"
                  autoComplete="off"
                  onChange={(e) => setValue(`images.${index}`, e.target.value, { shouldValidate: true })}
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ minWidth: 'auto', p: '6px 8px' }}
                >
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setValue(`images.${index}`, reader.result, { shouldValidate: true });
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }
                    }}
                  />
                </Button>
                <IconButton
                  aria-label="delete"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => append('')}
            >
              Add Image
            </Button>
          </Box>

          {/* Preview first image */}
          {images?.[0] && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <img
                src={images[0]}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 8,
                  display: 'block',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          )}

          <FormControlLabel
            control={
              <Switch
                {...register('isActive')}
                defaultChecked
                color="primary"
                onChange={(e) => setValue('isActive', e.target.checked, { shouldValidate: true })}
              />
            }
            label="Is Active"
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancelClick} disabled={loadingSubmit}>
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

      <Snackbar
        open={successMsgOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessMsgOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Product created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={5000}
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          You have unsaved changes. Are you sure you want to discard them?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="error">
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductForm;
