import React, { useState } from 'react';
import {
  Grid, TextField, FormControl, InputLabel, Select, FormControlLabel,
  Switch, Box, Typography, FormHelperText, IconButton, Paper,
  Button, Collapse, CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller } from 'react-hook-form';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ProductForm = ({
  activeStep,
  register,
  errors,
  control,
  onSkuManualEdit,
  watchedSku,
  categoryOptions = [],
  images = [],
  onImageRemove,
  onImageDrop,
  // Props for inline category creation
  showAddCategory,
  onToggleAddCategory,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  isCreatingCategory,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  // --- Manual Drag-and-Drop Handlers ---
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
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Core Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register('name')}
                label="Product Name"
                fullWidth
                required
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
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
                    />
                    <Button variant="contained" onClick={onCreateCategory} disabled={isCreatingCategory}>
                      {isCreatingCategory ? <CircularProgress size={20}/> : 'Save'}
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('sku', { required: 'SKU is required' })}
                label="SKU (Stock Keeping Unit)"
                fullWidth
                required
                error={!!errors.sku}
                helperText={errors.sku?.message}
                onChange={(e) => {
                  register('sku').onChange(e); // Propagate change to react-hook-form
                  onSkuManualEdit();          // Notify parent of manual edit
                }}
                InputLabelProps={{ shrink: !!watchedSku }}
              />
            </Grid>
          </Grid>
        );
      case 1: // Pricing & Inventory
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                  validate: (value) => value > 0 || 'Price must be a positive number',
                })}
                label="Price"
                type="number"
                fullWidth
                required
                InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('stock', {
                  required: 'Stock is required',
                  valueAsNumber: true,
                  validate: (value) => Number.isInteger(value) && value >= 0 || 'Stock must be a non-negative integer',
                })}
                label="Stock"
                type="number"
                fullWidth
                required
                error={!!errors.stock}
                helperText={errors.stock?.message}
              />
            </Grid>
          </Grid>
        );
      case 2: // Media
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...register('description')} label="Description" multiline rows={4} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom component="div">Images</Typography>
              <Box
                onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                sx={{
                  border: `2px dashed ${errors.images ? theme.palette.error.main : (isDragging ? theme.palette.primary.main : 'grey.400')}`,
                  backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
                  padding: 4, borderRadius: 1, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out'
                }}
              >
                <input id="file-upload-input" type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                <label htmlFor="file-upload-input" style={{ cursor: 'pointer' }}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography>{isDragging ? "Drop the images here..." : "Drag 'n' drop images here, or click to select"}</Typography>
                </label>
              </Box>
              {errors.images && <FormHelperText error sx={{ ml: 2 }}>{errors.images.message}</FormHelperText>}
              {images.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {images.map((image, index) => (
                    <Paper key={index} elevation={2} sx={{ position: 'relative', width: 100, height: 100, overflow: 'hidden' }}>
                      <img src={image.preview} alt={image.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small" onClick={() => onImageRemove(index)}
                        sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' } }}
                      ><DeleteIcon fontSize="small" /></IconButton>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        );
      case 3: // Finalize
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Review and Finalize</Typography>
            <Typography color="text.secondary" mb={3}>You're almost done! You can preview the product or create it directly.</Typography>
            <FormControlLabel
              control={<Controller name="isActive" control={control} render={({ field }) => <Switch {...field} checked={!!field.value} onChange={field.onChange} />} />}
              label="Set product as active on creation"
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return <Box sx={{ mt: 3, minHeight: 320 }}>{renderStepContent(activeStep)}</Box>;
};

export default ProductForm;