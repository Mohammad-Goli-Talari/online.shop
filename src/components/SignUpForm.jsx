import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Stack
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';

function SignUpForm({ switchForm }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialSignup = (platform) => {
    window.location.href = `/auth/${platform}`;
  };

  return (
    <Box textAlign="center">
      <Typography variant="h6" fontWeight="bold">Get started absolutely free</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Already have an account?{' '}
        <Link href="#" onClick={switchForm} underline="none" sx={{ color: 'green' }}>Get started</Link>
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}><TextField fullWidth label="First name" /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Last name" /></Grid>
      </Grid>

      <TextField fullWidth label="Email address" sx={{ mt: 2 }} />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        sx={{ mt: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.5, backgroundColor: '#1c1c1c' }}>
        Create account
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        By signing up, I agree to <Link href="#">Terms of service</Link> and <Link href="#">Privacy policy</Link>.
      </Typography>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>OR</Typography>

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <IconButton onClick={() => handleSocialSignup('google')} sx={{ border: '1px solid #db4437', color: '#db4437' }}>
          <GoogleIcon />
        </IconButton>
        <IconButton onClick={() => handleSocialSignup('github')} sx={{ border: '1px solid #24292e', color: '#24292e' }}>
          <GitHubIcon />
        </IconButton>
        <IconButton onClick={() => handleSocialSignup('x')} sx={{ border: '1px solid #000000', color: '#000000' }}>
          <XIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default SignUpForm;
