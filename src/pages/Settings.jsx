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

const Settings = () => {
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
    <AccountLayout title="Settings">
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
            Save All
          </Button>
        }
      >
        Changes are saved automatically. Use "Save All" to sync with your account.
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
                    primary="Email Notifications"
                    secondary="Receive order updates and promotional emails"
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
                    primary="SMS Notifications"
                    secondary="Get text updates for urgent order changes"
                  />
                  <FormControlLabel
                    control={<Switch disabled />}
                    label=""
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Browser notifications for new features"
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
                    primary="Dark Mode"
                    secondary="Toggle between light and dark themes"
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
                    primary="Language"
                    secondary="Choose your preferred language"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Language</InputLabel>
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
                    secondary="Add an extra layer of security to your account"
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
                    primary="Data Privacy"
                    secondary="Manage how your data is used and shared"
                  />
                  <Button size="small" variant="outlined">
                    Manage
                  </Button>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Login Sessions"
                    secondary="View and manage your active sessions"
                  />
                  <Button size="small" variant="outlined">
                    View
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
                  Delete Account
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