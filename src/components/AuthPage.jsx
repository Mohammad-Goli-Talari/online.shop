import React, { useState } from 'react';
import { Grid, Paper, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

function AuthPage() {
  const [showSignup, setShowSignup] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {!isSmallScreen && (
        <Grid item xs={false} sm={4} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Hamed Boutiq
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              If you don't like so we will exchange
            </Typography>
            <Box
              component="img"
              src="src\assets\hamed 1.png"
              alt="model"
              sx={{ mt: 4, width: '100%', borderRadius: 2 }}
            />
          </Box>
        </Grid>
      )}

      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={0} square>
        <Box
          maxWidth="sm"
          sx={{
            height: '100%',
            px: 2,
            py: 4,
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            width="100%"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {showSignup ? (
              <SignUpForm switchForm={() => setShowSignup(false)} />
            ) : (
              <SignInForm switchForm={() => setShowSignup(true)} />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthPage;