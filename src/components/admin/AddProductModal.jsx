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
import ProductPreview from './ProductPreview';
import { useTranslation } from '../../hooks/useTranslation.js';
import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';

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
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isSkuManuallyEdited, setIsSkuManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
      // Ignore errors when revoking object URLs
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
    setShowPreview(false);
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
    setShowPreview(false);
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
    const isAllValid = await trigger();
    if (!isAllValid) {
        scrollFirstErrorIntoView();
        setShowPreview(false);
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
      maxWidth="sm"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '100%' : 'auto',
          maxHeight: isMobile ? '100%' : '95vh', // Increased slightly if needed
          borderRadius: isMobile ? 0 : 4,
          maxWidth: isMobile ? '100%' : '700px',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">{showPreview ? 'Product Preview' : 'Add New Product'}</Typography>
        <IconButton
          aria-label="close"
          onClick={() => handleClose()}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form id="add-product-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          ref={dialogContentRef}
          sx={{
            p: isMobile ? 2 : 4,
            backgroundColor: showPreview ? 'grey.50' : 'transparent',
            minHeight: '400px',
          }}
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
              <Box display="flex" justifyContent="center" mb={4} p={0.5} sx={{ borderRadius: '25px', backgroundColor: 'grey.200', maxWidth: 500, mx: 'auto' }}>
                {steps.map((label, index) => (
                  <Button
                    key={label}
                    variant={activeStep === index ? 'contained' : 'text'}
                    onClick={() => setActiveStep(index)}
                    sx={{
                      flex: 1,
                      borderRadius: '20px',
                      textTransform: 'none',
                      // Constant font weight prevents layout shift during state changes
                      fontWeight: 500,
                      color: activeStep === index ? 'white' : 'text.secondary',
                      boxShadow: activeStep === index ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      '&.MuiButton-contained': { backgroundColor: 'primary.main' },
                      '&.MuiButton-text': { backgroundColor: 'transparent' }
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
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
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: isMobile ? 2 : 3}}>
          {showPreview ? (
            <>
              <Button variant="outlined" onClick={() => setShowPreview(false)}>
{t('ui.backToEdit')}
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button 
                variant="contained" 
                onClick={() => document.getElementById('add-product-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
      disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="text" disabled={activeStep === 0 || isSubmitting} onClick={handleBack} sx={{mr: 1}}>
{t('ui.previousStep')}
              </Button>
              {activeStep === steps.length - 1 ? (
                <>
                  <Button variant="outlined" onClick={handlePreviewClick} disabled={isSubmitting} sx={{mr: 1}}>
                    Preview
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleNext}>
{t('ui.nextStep')}
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;