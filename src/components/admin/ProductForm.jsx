// src/components/admin/ProductForm.jsx
import React, { useRef } from 'react';
import {
  Grid, TextField, FormControl, InputLabel, Select, FormControlLabel,
  Switch, Box, Typography, FormHelperText, IconButton, Button,
  Collapse, CircularProgress, InputAdornment, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller } from 'react-hook-form';
import { CameraAltOutlined as CameraIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ProductForm = ({
  activeStep,
  register,
  errors,
  control,
  onSkuManualEdit,
  watchedValues,
  categoryOptions = [],
  images = [],
  onImageRemove,
  onImageDrop,
  showAddCategory,
  onToggleAddCategory,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  isCreatingCategory,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = useRef(null);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const watchedDescription = watchedValues?.description || '';

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
      e.target.value = '';
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Product Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ flexGrow: isMobile ? 0.61 : 1 }}>
              <TextField
                {...register('name', {
                  required: 'Product name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
                label="Product Name"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.categoryId}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select {...field} labelId="category-select-label" label="Category" fullWidth>
                      {categoryOptions}
                    </Select>
                  )}
                />
                {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
              </FormControl>
              <Box mt={1} sx={{ width: '100%' }}>
                <Button size="small" startIcon={<AddIcon />} onClick={onToggleAddCategory}>
                  {showAddCategory ? 'Cancel' : 'Add New Category'}
                </Button>
                <Collapse in={showAddCategory}>
                  <Box display="flex" gap={2} mt={1} p={2} border="1px solid" borderColor="divider" borderRadius={1} width="100%">
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
            <Grid item xs={12} md={6} sx={{ flexGrow: isMobile ? 0.61 : 0.5 }}>
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
                    InputLabelProps={{ shrink: !!watchedValues?.sku }}
                    autoComplete="off"
                  />
                );
              })()}
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={!!field.value} />}
                  />
                }
                label="Set product as active on creation"
              />
            </Grid>
            {/* END OF CHANGES */}
          </Grid>
        );

      case 1: // Images & Description
        return (
          <Grid container spacing={3}>
            {/* Left Column: Image Upload */}
            <Grid item xs={12} md={6} sx={{ flexGrow: isMobile ? 1 : 0 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>Upload Product Images</Typography>
                <Box
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  sx={{
                    border: `2px dashed ${errors.images ? theme.palette.error.main : (isDragging ? theme.palette.primary.main : 'grey.300')}`,
                    backgroundColor: isDragging ? theme.palette.action.hover : 'grey.50',
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    width: '100%',
                    mb: 1,
                  }}
                  onClick={() => fileInputRef.current?.click()}
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
                  <Box
                    sx={{
                        width: 45, height: 30, borderRadius: '40%',
                      backgroundColor: 'grey.200',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mx: 'auto', mb: 1,
                    }}
                  >
                    <CameraIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Drag and drop images here or click to upload
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mb: 2, textTransform: 'none', fontSize: '1rem', py: 1 }}
                >
                  Browse Files
                </Button>

                <Grid container spacing={1.5}>
                  {images.length === 0 ? (
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                        <Typography color="text.secondary">No images uploaded yet.</Typography>
                      </Box>
                    </Grid>
                  ) : (
                    images.map((image, index) => {
                      let previewUrl = image.preview;
                      if (!previewUrl && image.file) {
                        try {
                          previewUrl = URL.createObjectURL(image.file);
                        } catch {
                          previewUrl = 'https://via.placeholder.com/300x300.png?text=No+Preview';
                        }
                      }
                      return (
                        <Grid item xs={6} key={index}>
                          <Box sx={{
                            position: 'relative',
                            width: '100%',
                            height: 100,
                            borderRadius: 2,
                            boxShadow: 1,
                            backgroundColor: 'grey.100',
                            overflow: 'hidden',
                          }}>
                            <img
                              src={previewUrl}
                              alt={image.file?.name || `image-${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); onImageRemove(index); }}
                              sx={{
                                position: 'absolute', top: 4, right: 4,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'white' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
                {errors.images && <FormHelperText error sx={{ mt: 1 }}>{errors.images.message}</FormHelperText>}
              </Box>
            </Grid>

            {/* Right Column: Description */}
            <Grid item xs={12} md={6} flexGrow={1}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>Product Description</Typography>
                <TextField
                  {...register('description', {
                    maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
                  })}
                  placeholder="Describe your product in detail..."
                  multiline
                  rows={5}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description ? errors.description.message : `${watchedDescription.length} / 500 characters`}
                  autoComplete="off"
                />
              </Box>
            </Grid>
          </Grid>
        );

      case 2: // Pricing & Inventory (NO CHANGES NEEDED, ALREADY CORRECT)
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} flexGrow={0.5}>
              <TextField
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  validate: (value) => value > 0 || 'Price must be positive',
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
            <Grid item xs={12} md={6} sx={{ flexGrow: isMobile ? 0.54 : 1 }}>
              <TextField
                {...register('stock', {
                  required: 'Stock is required',
                  valueAsNumber: true,
                  validate: (value) => (Number.isInteger(value) && value >= 0) || 'Stock must be a non-negative integer',
                })}
                label="Stock"
                type="number"
                fullWidth
                required
                error={!!errors.stock}
                helperText={errors.stock?.message}
                InputLabelProps={{ shrink: watchedValues?.stock != null && watchedValues?.stock !== '' }}
                autoComplete="off"
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return <Box sx={{ width: '100%' }}>{renderStepContent(activeStep)}</Box>;
};

export default ProductForm;