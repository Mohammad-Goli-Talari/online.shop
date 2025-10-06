import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  PrivacyTip as PrivacyIcon,
  Save as SaveIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import AccountLayout from '../layouts/AccountLayout';
import { useTranslation } from '../hooks/useTranslation.js';

const Settings = () => {
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [language, setLanguage] = React.useState('en-US');

  const handleSaveSettings = () => {
    console.log('Settings saved:', {
      emailNotifications,
      darkMode,
      twoFactor,
      language
    });
  };

  return (
    <AccountLayout title={t('ui.settings')}>
      {/* Settings Notice */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 3 }}
        action={
          <Button 
            color="inherit" 
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
{t('ui.saveAll')}
          </Button>
        }
      >
        {t('ui.changesSavedAutomatically')}
      </Alert>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary={t('ui.emailNotifications')}
                    secondary={t('ui.receiveOrderUpdates')}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={t('ui.smsNotifications')}
                    secondary={t('ui.getTextUpdates')}
                  />
                  <FormControlLabel
                    control={<Switch disabled />}
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={t('ui.pushNotifications')}
                    secondary={t('ui.browserNotifications')}
                  />
                  <FormControlLabel
                    control={<Switch disabled />}
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PaletteIcon sx={{ mr: 1 }} />
                Appearance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary={t('ui.darkMode')}
                    secondary={t('ui.toggleThemes')}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={t('ui.language')}
                    secondary={t('ui.chooseLanguage')}
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>{t('ui.language')}</InputLabel>
                    <Select
                      value={language}
                      label="Language"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="en-US">English (US)</MenuItem>
                      <MenuItem value="en-GB">English (UK)</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                Privacy & Security
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary={t('ui.addSecurityLayer')}
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PrivacyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('ui.dataPrivacy')}
                    secondary={t('ui.manageDataUsage')}
                  />
                  <Button size="small" variant="outlined">
                    Manage
                  </Button>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary={t('ui.loginSessions')}
                    secondary={t('ui.manageSessions')}
                  />
                  <Button size="small" variant="outlined">
{t('common.view')}
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  fullWidth
                >
                  Change Password
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="warning"
                  fullWidth
                >
                  Export My Data
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  fullWidth
                >
{t('ui.deleteAccount')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Future Features */}
      <Paper 
        elevation={0}
        sx={{ 
          mt: 4, 
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary">
          More settings and customization options including advanced privacy controls, 
          payment preferences, and shipping defaults will be available in future updates!
        </Typography>
      </Paper>
    </AccountLayout>
  );
};

export default Settings;