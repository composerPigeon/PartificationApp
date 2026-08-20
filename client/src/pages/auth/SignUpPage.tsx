import { Box, Container, Typography } from '@mui/material'

function SignUpPage() {
  return (
    <Box component="main" sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center' }}>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h3" align="center">
          Create an account
        </Typography>
      </Container>
    </Box>
  )
}

export default SignUpPage
