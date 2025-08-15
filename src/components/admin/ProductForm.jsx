// src/components/admin/ProductForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, TextField, FormControl, InputLabel, Select, FormControlLabel,
  Switch, Box, Typography, FormHelperText, IconButton, Paper,
  Button, Collapse, CircularProgress, InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Controller } from 'react-hook-form';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Add as AddIcon, Link as LinkIcon } from '@mui/icons-material';

const ProductForm = ({
  activeStep,
  register,
  errors,
  control,
  onSkuManualEdit,
  watchedSku,
  watchedStock,
  categoryOptions = [],
  images = [],
  onImageRemove,
  onImageDrop,
  onAddImageUrl,
  showAddCategory,
  onToggleAddCategory,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  isCreatingCategory,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeStep === 0 && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 200);
    }
  }, [activeStep]);

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageDrop(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageDrop(Array.from(e.target.files));
      // reset input so same files can be re-picked if needed
      e.target.value = '';
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register('name', {
                  required: 'Product name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
                label="Product Name"
                fullWidth
                required
                inputRef={nameInputRef}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.categoryId}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select {...field} labelId="category-select-label" label="Category">
                      {categoryOptions}
                    </Select>
                  )}
                />
                {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
              </FormControl>

              <Box mt={1}>
                <Button size="small" startIcon={<AddIcon />} onClick={onToggleAddCategory}>
                  {showAddCategory ? 'Cancel' : 'Add New Category'}
                </Button>
                <Collapse in={showAddCategory}>
                  <Box display="flex" gap={2} mt={1} p={2} border="1px solid" borderColor="divider" borderRadius={1}>
                    <TextField
                      label="New Category Name"
                      value={newCategoryName}
                      onChange={onNewCategoryNameChange}
                      size="small"
                      fullWidth
                      autoComplete="off"
                    />
                    <Button variant="contained" onClick={onCreateCategory} disabled={isCreatingCategory || !newCategoryName.trim()}>
                      {isCreatingCategory ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {(() => {
                const skuField = register('sku', { required: 'SKU is required' });
                return (
                  <TextField
                    {...skuField}
                    label="SKU (Stock Keeping Unit)"
                    fullWidth
                    required
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                    onChange={(e) => {
                      onSkuManualEdit();
                      skuField.onChange(e);
                    }}
                    InputLabelProps={{ shrink: !!watchedSku }}
                    autoComplete="off"
                  />
                );
              })()}
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  validate: (value) => {
                    if (isNaN(value)) return 'Price is required';
                    if (value <= 0) return 'Price must be positive';
                    return true;
                  },
                })}
                label="Price"
                type="number"
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={!!errors.price}
                helperText={errors.price?.message}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('stock', {
                  required: 'Stock is required',
                  valueAsNumber: true,
                  validate: (value) => {
                    if (isNaN(value)) return 'Stock is required';
                    if (!Number.isInteger(value) || value < 0) return 'Stock must be a non-negative integer';
                    return true;
                  },
                })}
                label="Stock"
                type="number"
                fullWidth
                required
                error={!!errors.stock}
                helperText={errors.stock?.message}
                InputLabelProps={{ shrink: watchedStock != null && watchedStock !== '' }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom component="div">Images</Typography>

            {/* Dropzone */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              sx={{
                border: `2px dashed ${errors.images ? theme.palette.error.main : (isDragging ? theme.palette.primary.main : 'grey.400')}`,
                backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
                padding: 4,
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <input
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2">
                {isDragging ? "Drop here..." : "Drag & drop images here, or click to upload"}
              </Typography>
            </Box>

            {/* Add by URL */}
            <Box display="flex" gap={1} mb={2} flexDirection={isXs ? 'column' : 'row'}>
              <TextField
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                label="Image URL"
                placeholder="https://cdn.example.com/image.jpg"
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon fontSize="small" /></InputAdornment> }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (imageUrl.trim()) {
                    onAddImageUrl(imageUrl.trim());
                    setImageUrl('');
                  }
                }}
              >
                Add URL
              </Button>
            </Box>

            {errors.images && <FormHelperText error sx={{ ml: 0, mb: 1 }}>{errors.images.message}</FormHelperText>}

            {images.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1.5} mb={3}>
                {images.map((image, index) => (
                  <Paper key={index} elevation={2} sx={{ position: 'relative', width: 80, height: 80, overflow: 'hidden' }}>
                    <img
                      src={image.preview}
                      alt={image.file?.name || `image-${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <IconButton
                      size="small"
                      onClick={() => onImageRemove(index)}
                      sx={{
                        position: 'absolute', top: 2, right: 2,
                        backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                      }}
                      aria-label="remove image"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}

            <TextField
              {...register('description')}
              label="Description"
              multiline
              rows={4}
              fullWidth
              autoComplete="off"
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Review and Finalize</Typography>
            <Typography color="text.secondary" mb={3}>
              You're almost done! You can preview the product or create it directly.
            </Typography>
            <FormControlLabel
              control={
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => <Switch {...field} checked={!!field.value} onChange={field.onChange} />}
                />
              }
              label="Set product as active on creation"
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return <Box>{renderStepContent(activeStep)}</Box>;
};

export default ProductForm;
