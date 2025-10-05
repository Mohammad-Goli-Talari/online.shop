import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import AccountLayout from '../layouts/AccountLayout';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  const getUserInitials = (user) => {
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AccountLayout title="Profile">
      {/* Profile Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              bgcolor: 'primary.main'
            }}
          >
            {getUserInitials(user)}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.fullName || 'User Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                icon={<VerifiedIcon />}
                label={user.emailVerified ? 'Verified' : 'Unverified'}
                color={user.emailVerified ? 'success' : 'warning'}
                size="small"
              />
              <Chip 
                label={user.role || 'Customer'} 
                color="primary" 
                size="small"
              />
            </Box>
          </Box>

          <Tooltip title="Edit Profile">
            <IconButton 
              color="primary"
              sx={{ 
                border: '1px solid',
                borderColor: 'primary.main'
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Profile Details Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={user.fullName || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Address"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary="Not provided"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary="Not provided"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1 }} />
                Account Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Account Role"
                    secondary={user.role}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Member Since"
                    secondary={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email Verification"
                  />
                  <Chip 
                    icon={<VerifiedIcon />}
                    label={user.emailVerified ? 'Verified' : 'Unverified'}
                    color={user.emailVerified ? 'success' : 'warning'}
                    size="small"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Coming Soon
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body2" color="text.secondary">
                Profile editing, order history, and more features will be available soon!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AccountLayout>
  );
};

export default Profile;