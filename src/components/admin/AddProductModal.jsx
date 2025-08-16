// src/components/admin/AddProductModal.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Alert,
  useMediaQuery,
  Box,
  Typography,
  MenuItem,
  Button,
  CircularProgress,
  DialogActions,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import ProductForm from './ProductForm';
import ProductPreview from './ProductPreview'; // Import the new component
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';

// ... (compressImage and generateSku functions remain unchanged)
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === 'image/png';
        const mime = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? undefined : 0.85;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const name = file.name.replace(/\.(png|jpg|jpeg|webp|gif)$/i, isPng ? '.png' : '.jpg');
              resolve(new File([blob], name, { type: mime, lastModified: Date.now() }));
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          mime,
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const generateSku = (text) => {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/--+/g, '-')
    .toUpperCase();
};


const steps = ['Product Details', 'Images & Description', 'Pricing & Inventory'];

const AddProductModal = ({ open, onClose, onSuccess, onCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // New state for preview

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const dialogContentRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    clearErrors,
    watch,
    trigger,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: '',
      sku: '',
      stock: '',
      categoryId: '',
      isActive: true,
      images: [],
    },
  });

  const watchedValues = watch();
  const watchedName = watch('name');

  // ... (All useEffects and handler functions up to handleClose remain the same)
  useEffect(() => {
    if (!isSkuManuallyEdited && watchedName && watchedName.trim()) {
      const generatedSku = generateSku(watchedName);
      setValue('sku', generatedSku, { shouldValidate: true });
    }
  }, [watchedName, isSkuManuallyEdited, setValue]);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await CategoryService.getCategories();
      const list =
        response?.categories ||
        response?.items ||
        response?.data ||
        (Array.isArray(response) ? response : []) ||
        [];
      setCategories(list);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Could not load categories.';
      setApiError(message);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchCategories();
  }, [open, fetchCategories]);

  useEffect(() => {
    register('images', {
      validate: (value) => (value && value.length > 0) || 'At least one image is required.',
    });
  }, [register]);
  
  const revokeIfObjectURL = (item) => {
    try {
      if (item?.file && item?.preview && item.preview.startsWith('blob:')) {
        URL.revokeObjectURL(item.preview);
      }
    } catch {
      // Safe to ignore
    }
  };

  useEffect(() => {
    return () => {
      imageFiles.forEach(revokeIfObjectURL);
    };
  }, [imageFiles]);

  const handleImageDrop = useCallback(
    async (acceptedFiles) => {
      clearErrors('images');
      setApiError(null);
      const validImageFiles = acceptedFiles.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setApiError(`File "${file.name}" is not a valid image.`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          setApiError(`Image "${file.name}" is too large (max 5MB).`);
          return false;
        }
        return true;
      });
      const compressedFiles = await Promise.all(
        validImageFiles.map(async (file) => {
          try {
            const compressedFile = await compressImage(file);
            return { file: compressedFile, preview: URL.createObjectURL(compressedFile) };
          } catch {
            return { file, preview: URL.createObjectURL(file) };
          }
        })
      );
      const updatedImages = [...imageFiles, ...compressedFiles];
      setImageFiles(updatedImages);
      setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });
      trigger('images');
    },
    [imageFiles, setValue, clearErrors, trigger]
  );
  
  const handleImageRemove = (index) => {
    const toRemove = imageFiles[index];
    revokeIfObjectURL(toRemove);
    const updatedImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedImages);
    setValue('images', updatedImages, { shouldValidate: true, shouldDirty: true });
    trigger('images');
  };

  const handleClose = (force = false) => {
    if (!force && isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
    imageFiles.forEach(revokeIfObjectURL);
    reset();
    setActiveStep(0);
    setIsSkuManuallyEdited(false);
    setImageFiles([]);
    setApiError(null);
    setShowAddCategory(false);
    setShowPreview(false); // Reset preview state on close
    onClose();
  };

  const scrollFirstErrorIntoView = () => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;
    const el = dialogContentRef.current?.querySelector(`[name="${firstErrorKey}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNext = async () => {
    const fieldsPerStep = [
      ['name', 'categoryId', 'sku'],
      ['images', 'description'],
      ['price', 'stock'],
    ];
    const fieldsToValidate = fieldsPerStep[activeStep];
    const isValid = fieldsToValidate ? await trigger(fieldsToValidate) : true;
    if (isValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      scrollFirstErrorIntoView();
    }
  };

  const handleBack = () => {
    setShowPreview(false); // Go back to form if in preview
    setActiveStep((prev) => prev - 1);
  };
  
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const newCategory = await CategoryService.createCategory({ name: newCategoryName.trim() });
      await fetchCategories();
      const newId = newCategory?.id || newCategory?.data?.id || newCategory?.item?.id;
      if (newId) {
        setValue('categoryId', newId, { shouldValidate: true, shouldDirty: true });
      }
      setNewCategoryName('');
      setShowAddCategory(false);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create category.';
      setApiError(message);
    } finally {
      setIsCreatingCategory(false);
    }
  };
  
  const handleSkuManualEdit = () => {
    setIsSkuManuallyEdited(true);
  };

  const onSubmit = async (data) => {
    // Final validation before submitting
    const isAllValid = await trigger();
    if (!isAllValid) {
        scrollFirstErrorIntoView();
        setShowPreview(false); // Go back to the form to show errors
        return;
    }
    setApiError(null);
    const category = categories.find((c) => c.id === data.categoryId) || { name: 'N/A' };
    const optimisticProduct = {
      ...data,
      id: `temp-${Date.now()}`,
      images: imageFiles.map((img) => img.preview),
      category,
      createdAt: new Date().toISOString(),
    };
    onSuccess?.(optimisticProduct);
    handleClose(true);

    try {
      const urlImages = imageFiles.filter((i) => i.isUrl && i.preview).map((i) => i.preview);
      const payload = {
        name: data.name.trim(),
        description: data.description || null,
        price: Number(data.price),
        sku: data.sku.trim(),
        stock: Number.isFinite(data.stock) ? Number(data.stock) : 0,
        categoryId: data.categoryId,
        isActive: !!data.isActive,
        ...(urlImages.length ? { images: urlImages } : {}),
      };
      const created = await ProductService.createProduct(payload);
      const createdId = created?.id || created?.data?.id || created?.item?.id;
      const fileImages = imageFiles.filter((i) => i.file).map((i) => i.file);
      if (createdId && fileImages.length) {
        await ProductService.uploadProductImages(createdId, fileImages);
      }
      onCreated?.(createdId || null);
    } catch (error) {
      console.error('Failed to save product to the server:', error);
      const message = error?.response?.data?.message || error?.message || 'Error: Could not save the new product.';
      alert(message);
    }
  };

  const handlePreviewClick = async () => {
    const isAllValid = await trigger();
    if (isAllValid) {
      setShowPreview(true);
    } else {
      scrollFirstErrorIntoView();
    }
  };

  const categoryOptions = [
    <MenuItem key="loading" value="" disabled={loadingCategories}>
      <em>{loadingCategories ? 'Loading...' : 'Select a category'}</em>
    </MenuItem>,
    ...categories.map((cat) => (
      <MenuItem key={cat.id} value={cat.id}>
        {cat.name}
      </MenuItem>
    )),
  ];

  const categoryName = categories.find((c) => c.id === watchedValues.categoryId)?.name;

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '100%' : '650px',
          maxHeight: isMobile ? '100%' : '90vh',
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', textAlign: 'center', pt: 3, pb: 2 }}>
        <Typography variant="h6" component="div">{showPreview ? 'Product Preview' : 'Add New Product'}</Typography>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        ref={dialogContentRef}
        sx={{ flexGrow: 1, overflowY: 'auto', p: isMobile ? 2 : 4, backgroundColor: showPreview ? 'grey.50' : 'transparent' }}
      >
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        {showPreview ? (
          <ProductPreview
            formData={watchedValues}
            images={imageFiles}
            categoryName={categoryName}
          />
        ) : (
          <>
            <Box display="flex" justifyContent="center" mb={4} flexWrap="wrap" gap={1}>
              {steps.map((label, index) => (
                <Button key={label} variant={activeStep === index ? 'contained' : 'text'} /* ...styles */ >
                  {label}
                </Button>
              ))}
            </Box>
            <form id="add-product-form" onSubmit={handleSubmit(onSubmit)}>
              <ProductForm
                activeStep={activeStep}
                register={register}
                errors={errors}
                control={control}
                onSkuManualEdit={handleSkuManualEdit}
                watchedValues={watchedValues}
                categoryOptions={categoryOptions}
                images={imageFiles}
                onImageRemove={handleImageRemove}
                onImageDrop={handleImageDrop}
                showAddCategory={showAddCategory}
                onToggleAddCategory={() => setShowAddCategory(!showAddCategory)}
                newCategoryName={newCategoryName}
                onNewCategoryNameChange={(e) => setNewCategoryName(e.target.value)}
                onCreateCategory={handleCreateCategory}
                isCreatingCategory={isCreatingCategory}
              />
            </form>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3, borderTop: 1, borderColor: 'divider' }}>
        {showPreview ? (
          <>
            <Button variant="outlined" onClick={() => setShowPreview(false)}>
              Back to Edit
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" type="submit" form="add-product-form" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="text" disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>
              Previous Step
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {activeStep === steps.length - 1 ? (
              <>
                <Button variant="outlined" onClick={handlePreviewClick} disabled={isSubmitting}>
                  Preview
                </Button>
                <Button variant="contained" type="submit" form="add-product-form" disabled={isSubmitting} sx={{ ml: 1 }}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next Step
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;