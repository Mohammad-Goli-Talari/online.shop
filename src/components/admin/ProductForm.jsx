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
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import { debounce } from 'lodash';

const schema = yup.object().shape({
  name: yup.string().required('Product name is required').min(3, 'Name must be at least 3 characters'),
  sku: yup.string().required('SKU is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  stock: yup.number().typeError('Stock must be a number').integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().nullable(),
  images: yup.array().of(
    yup.string().required('Image is required').test('is-valid-image', 'Must be a valid URL or base64 image', (value) => {
      if (!value) return false;
      return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/');
    })
  ).min(1, 'At least one image is required'),
  isActive: yup.boolean(),
});

// helper: compress image -> dataURL (canvas)
const compressImageToDataUrl = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = img.width / img.height;
        let targetWidth = img.width;
        let targetHeight = img.height;
        if (img.width > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth / ratio);
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, outputType === 'image/png' ? 1.0 : quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
};

const ProductForm = ({ onCancel, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [successMsgOpen, setSuccessMsgOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const [dropActive, setDropActive] = useState(false);
  const [fileError, setFileError] = useState('');

  // preview states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(null); // null -> full product preview

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
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

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });

  const name = watch('name');
  const sku = watch('sku');
  const images = watch('images');
  const description = watch('description');
  const category = watch('category');

  // SKU auto suggestion
  useEffect(() => {
    if (!name || isSkuManuallyEdited) return;
    const generateSku = debounce(() => {
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const random = Math.floor(1000 + Math.random() * 9000);
      const newSku = `pro-${slug}-${random}`;
      setValue('sku', newSku, { shouldValidate: true });
    }, 400);
    generateSku();
    return () => generateSku.cancel && generateSku.cancel();
  }, [name, isSkuManuallyEdited, setValue]);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await CategoryService.getCategories();
        if (res && Array.isArray(res.categories)) setCategories(res.categories);
        else setCategories([]);
      } catch (e) {
        console.error('Failed to fetch categories', e);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // handle file(s) -> compress -> add to images
  const handleFiles = async (fileList, insertIndex = null) => {
    setFileError('');
    const files = Array.from(fileList || []);
    const maxSizeMB = 6;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    const processed = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setFileError('Only JPG/PNG/WebP/GIF images are allowed');
        continue;
      }
      if (file.size / 1024 / 1024 > maxSizeMB) {
        setFileError(`File ${file.name} is too large (> ${maxSizeMB}MB)`);
        continue;
      }
      try {
        const dataUrl = await compressImageToDataUrl(file, 1200, 0.8);
        processed.push(dataUrl);
      } catch (e) {
        console.warn('Compress failed, fallback to original base64', e);
        const readerResult = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(file);
        });
        processed.push(readerResult);
      }
    }

    if (processed.length === 0) return;

    if (typeof insertIndex === 'number') {
      // replace that index with first, append the rest
      setValue(`images.${insertIndex}`, processed[0], { shouldValidate: true, shouldDirty: true });
      for (let i = 1; i < processed.length; i++) append(processed[i]);
    } else {
      for (const p of processed) append(p);
    }
  };

  // drag/drop handlers
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDropActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDropActive(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDropActive(false); const files = e.dataTransfer?.files; if (files && files.length) handleFiles(files); };

  const handleFileInputChange = (e, index = null) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files, index);
    e.target.value = '';
  };

  // create category inline
  const openCreateCategory = () => { setCategoryName(''); setCategoryError(''); setCategoryDialogOpen(true); };
  const handleCreateCategory = async () => {
    if (!categoryName.trim()) { setCategoryError('Category name is required'); return; }
    setCreatingCategory(true); setCategoryError('');
    try {
      const res = await CategoryService.createCategory({ name: categoryName.trim() });
      const newCat = (res && res.category) || res;
      setCategories(prev => (newCat ? [...prev, newCat] : prev));
      if (newCat && (newCat.id || newCat._id)) setValue('category', (newCat.id || newCat._id).toString(), { shouldValidate: true });
      setCategoryDialogOpen(false);
    } catch (e) {
      console.error('Failed create category', e);
      setCategoryError(e?.message || 'Failed to create category');
    } finally { setCreatingCategory(false); }
  };

  // suggest SKU button
  const suggestSku = () => {
    if (!name) return;
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const suggestion = `pro-${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    setValue('sku', suggestion, { shouldValidate: true });
    setIsSkuManuallyEdited(false);
  };

  // preview open/close helpers
  const openPreview = (index = null) => { setCurrentPreviewIndex(index); setPreviewOpen(true); };
  const closePreview = () => { setPreviewOpen(false); setCurrentPreviewIndex(null); };

  // submit: return created product to parent via onSuccess(createdProduct)
  const onSubmit = async (data) => {
    setErrorMsg(''); setLoadingSubmit(true);
    try {
      const payload = {
        name: data.name,
        sku: data.sku,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        categoryId: parseInt(data.category, 10),
        description: data.description || null,
        images: data.images.filter((u) => u && u.toString().trim() !== ''),
        isActive: data.isActive,
      };
      const created = await ProductService.createProduct(payload);
      setSuccessMsgOpen(true);
      reset();
      // Pass returned created product/object to parent so it can refresh/update list
      onSuccess?.(created);
      onCancel?.();
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to create product');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // remove image (sync after remove)
  const handleRemoveImage = (index) => {
    remove(index);
    const newImages = getValues('images') || [];
    setValue('images', newImages, { shouldValidate: true, shouldDirty: true });
  };

  const handleCancelClick = () => { if (isDirty) setConfirmClose(true); else onCancel?.(); };
  const handleConfirmClose = () => { setConfirmClose(false); onCancel?.(); };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <Stack spacing={2}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          <TextField label="Product Name" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} autoComplete="off" />

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="SKU"
              fullWidth
              placeholder="Auto-generated SKU will appear here"
              value={sku || ''}
              {...register('sku')}
              error={!!errors.sku}
              helperText={errors.sku?.message}
              onChange={(e) => { setIsSkuManuallyEdited(true); setValue('sku', e.target.value); }}
              autoComplete="off"
            />
            <Button size="small" variant="outlined" onClick={suggestSku} sx={{ whiteSpace: 'nowrap' }}>Suggest SKU</Button>
          </Stack>

          <TextField label="Price" type="number" fullWidth {...register('price')} error={!!errors.price} helperText={errors.price?.message} inputProps={{ min: 0, step: '0.01' }} autoComplete="off" />

          <TextField label="Stock" type="number" fullWidth {...register('stock')} error={!!errors.stock} helperText={errors.stock?.message} inputProps={{ min: 0, step: 1 }} autoComplete="off" />

          {loadingCategories ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={24} /></Box>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
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
                {categories.map((cat) => (<MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</MenuItem>))}
              </TextField>
              <Button variant="outlined" size="small" onClick={openCreateCategory}>Add Category</Button>
            </Stack>
          )}

          {/* Rich text description (simple, using contentEditable) */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>Description</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Button size="small" variant="outlined" onClick={() => document.execCommand('bold')}>B</Button>
              <Button size="small" variant="outlined" onClick={() => document.execCommand('italic')}>I</Button>
              <Button size="small" variant="outlined" onClick={() => document.execCommand('insertUnorderedList')}>• List</Button>
              <Button size="small" variant="outlined" onClick={() => { const url = window.prompt('Enter URL'); if (url) document.execCommand('createLink', false, url); }}>Link</Button>
            </Stack>
            <Box component="div"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setValue('description', e.currentTarget.innerHTML, { shouldValidate: true, shouldDirty: true })}
              onBlur={(e) => setValue('description', e.currentTarget.innerHTML, { shouldValidate: true, shouldDirty: true })}
              dangerouslySetInnerHTML={{ __html: description || '' }}
              sx={{ minHeight: 120, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, overflow: 'auto' }} />
          </Box>

          {/* Drag-and-drop images */}
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>Images</Typography>

            <Box onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              sx={{ border: '2px dashed', borderColor: dropActive ? 'primary.main' : 'divider', borderRadius: 1, p: 2, mb: 2, textAlign: 'center', backgroundColor: dropActive ? 'action.hover' : 'transparent' }}>
              <Typography variant="caption">Drag & drop images here (JPG/PNG/WebP/GIF) or use upload buttons below.</Typography>
              {fileError && <Alert severity="error" sx={{ mt: 1 }}>{fileError}</Alert>}
            </Box>

            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField fullWidth {...register(`images.${index}`)} error={!!errors.images?.[index]} helperText={errors.images?.[index]?.message} placeholder="Image URL or click Upload" autoComplete="off" onChange={(e) => setValue(`images.${index}`, e.target.value, { shouldValidate: true })} />
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<UploadIcon />}
                  sx={{ px: 2, py: 0.6, minWidth: 110 }}
                >
                  Upload
                  <input type="file" accept="image/*" hidden onChange={(e) => handleFileInputChange(e, index)} />
                </Button>

                <IconButton aria-label={`preview-image-${index}`} size="small" onClick={() => openPreview(index)} sx={{ ml: 0.5 }}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton aria-label={`delete-image-${index}`} size="small" onClick={() => handleRemoveImage(index)} disabled={fields.length === 0} sx={{ ml: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={() => append('')}>Add Image</Button>

            {/* preview small of first image */}
            {images?.[0] && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <img src={images[0]} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, display: 'block', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </Box>
            )}
          </Box>

          <FormControlLabel control={<Switch {...register('isActive')} defaultChecked color="primary" onChange={(e) => setValue('isActive', e.target.checked, { shouldValidate: true })} />} label="Is Active" />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancelClick} disabled={loadingSubmit}>Cancel</Button>
            <Button type="button" variant="outlined" onClick={() => openPreview(null)} startIcon={<VisibilityIcon />}>Preview</Button>
            <Button type="submit" variant="contained" disabled={loadingSubmit || !isValid} startIcon={loadingSubmit && <CircularProgress size={16} />}>Add Product</Button>
          </Stack>
        </Stack>
      </Box>

      {/* category creation dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          {categoryError && <Alert severity="error">{categoryError}</Alert>}
          <TextField fullWidth label="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateCategory} disabled={creatingCategory}>{creatingCategory ? <CircularProgress size={16} /> : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* preview dialog */}
      <Dialog open={previewOpen} onClose={closePreview} fullWidth maxWidth="md">
        <DialogTitle>Product Preview</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="h6">{watch('name') || '—'}</Typography>

            {/* if currentPreviewIndex is not null => show that image large, else show gallery */}
            {currentPreviewIndex !== null ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img src={images?.[currentPreviewIndex]} alt={`img-${currentPreviewIndex}`} style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} onError={(e) => e.currentTarget.style.display = 'none'} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {images?.map((src, i) => (src ? (
                  <Box key={i} sx={{ minWidth: 120, minHeight: 80, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <img src={src} alt={`img-${i}`} style={{ width: '100%', height: 80, objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                  </Box>
                ) : null))}
              </Box>
            )}

            <Typography variant="subtitle1">Price: {typeof watch('price') === 'number' ? `$${watch('price').toFixed(2)}` : `$${watch('price') || '-'}`}</Typography>
            <Typography variant="subtitle2">SKU: {watch('sku') || '—'}</Typography>
            <Typography variant="body2">Category: {categories.find(c => (c.id || c._id)?.toString() === (watch('category') || '').toString())?.name || '-'}</Typography>
            <Divider />
            <Box>
              <Typography variant="body2">Description:</Typography>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }} dangerouslySetInnerHTML={{ __html: watch('description') || '<i>No description</i>' }} />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* confirm close unsaved */}
      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to discard your changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="error">Discard</Button>
        </DialogActions>
      </Dialog>

      {/* success snackbar */}
      <Snackbar open={successMsgOpen} autoHideDuration={3500} onClose={() => setSuccessMsgOpen(false)}>
        <Alert onClose={() => setSuccessMsgOpen(false)} severity="success" sx={{ width: '100%' }}>Product created successfully!</Alert>
      </Snackbar>
    </>
  );
};

export default ProductForm;