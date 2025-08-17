// src/components/admin/ProductForm.jsx
import React, { useRef } from 'react';
import {
  Grid, TextField, FormControl, InputLabel, Select, FormControlLabel,
  Switch, Box, Typography, FormHelperText, IconButton, Button,
  Collapse, CircularProgress, InputAdornment,
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
      case 0: // Product Details (No changes)
        return (
          <Grid container spacing={3}>
            {/* ... content for step 0 remains unchanged ... */}
            <Grid item xs={12}>
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
                    InputLabelProps={{ shrink: !!watchedValues?.sku }}
                    autoComplete="off"
                  />
                );
              })()}
            </Grid>
             <Grid item xs={12}>
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
          </Grid>
        );

      case 1: // Images & Description (Updated)
        return (
          <Grid container spacing={4}>
            {/* Left Column: Image Upload */}
            <Grid item xs={12} md={6}>
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
                  transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                  mb: 1
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
                    width: 48, height: 48, borderRadius: '50%',
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
                sx={{mb: 2, textTransform: 'none', fontSize: '1rem', py: 1}}
              >
                Browse Files
              </Button>
              
              <Grid container spacing={1.5}>
                  {images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={6} key={index}>
                      <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1, backgroundColor: 'grey.100' }}>
                        <img
                          src={image.preview}
                          alt={image.file?.name || `image-${index + 1}`}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); onImageRemove(index); }}
                          sx={{
                            position: 'absolute', top: 4, right: 4,
                            backgroundColor: 'rgba(255,255,255,0.8)', color: 'black',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                          aria-label="remove image"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
              {errors.images && <FormHelperText error sx={{ mt: 1 }}>{errors.images.message}</FormHelperText>}
            </Grid>

            {/* Right Column: Description */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Product Description</Typography>
              <TextField
                {...register('description', {
                  maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
                })}
                placeholder="Describe your product in detail, highlighting its features, benefits, and specifications."
                multiline
                // <<< THE FIX: Reduced rows to prevent scrolling in the modal >>>
                rows={7}
                fullWidth
                variant="outlined"
                error={!!errors.description}
                helperText={errors.description ? errors.description.message : `${watchedDescription.length} / 500 characters`}
                autoComplete="off"
                sx={{
                  height: '100%', 
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                    backgroundColor: 'grey.50',
                    '& fieldset': {
                        borderColor: 'grey.300',
                    },
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 2: // Pricing & Inventory (No changes)
        return (
          <Grid container spacing={3}>
           {/* ... content for step 2 remains unchanged ... */}
           <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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

  return <Box>{renderStepContent(activeStep)}</Box>;
};

export default ProductForm;