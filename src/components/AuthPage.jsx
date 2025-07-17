import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import { useLocation } from 'react-router-dom';
import hamedImg from '../assets/hamed 1.png'; // مسیر اصلاح‌شدهٔ تصویر

function AuthPage({ isSignin }) {
  const [showSignup, setShowSignup] = useState(!isSignin);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  useEffect(() => {
    // نمایش فرم بر اساس مسیر URL
    if (location.pathname === '/signin') setShowSignup(false);
    else if (location.pathname === '/signup') setShowSignup(true);
    else setShowSignup(true); // برای مسیر اصلی `/`
  }, [location.pathname]);

  return (
    <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
      {!isSmallScreen && (
        <Grid item xs={false} sm={4} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Hamed Boutiq
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              If you don't like so we will exchange
            </Typography>
            <Box component="img" src={hamedImg} alt="model" sx={{ mt: 4, width: '100%', borderRadius: 2 }} />
          </Box>
        </Grid>
      )}

      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={0} square>
        <Box sx={{ height: '100vh', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box width="100%" maxWidth="420px" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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