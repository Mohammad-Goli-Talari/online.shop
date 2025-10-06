import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Language as LanguageIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useLanguage } from '../../hooks/useLanguage.js';

const LanguageSelector = ({ variant = 'default', size = 'small' }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  if (variant === 'minimal') {
    return (
      <FormControl size={size} sx={{ minWidth: isMobile ? 80 : 120 }}>
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          displayEmpty
          IconComponent={ExpandMoreIcon}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.5
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
                <Typography variant="body2" sx={{ 
                  fontFamily: lang.code === 'fa' || lang.code === 'ar' ? 'inherit' : 'inherit'
                }}>
                  {lang.name}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size={size} sx={{ minWidth: isMobile ? 120 : 150 }}>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        startAdornment={<LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
        IconComponent={ExpandMoreIcon}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 0.5
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>
              <Typography variant="body2" sx={{ 
                fontFamily: lang.code === 'fa' || lang.code === 'ar' ? 'inherit' : 'inherit'
              }}>
                {lang.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
