import { Box, Container } from '@mui/material';

const AuthPage = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default AuthPage;