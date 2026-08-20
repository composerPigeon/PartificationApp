import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

function HomePage() {
  return (
    <Box component="main" sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center' }}>
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <Typography component="h1" variant="h2" align="center" sx={{ fontWeight: 700 }}>
            Welcome to Partification
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={Link} to="/login" variant="outlined">
              Log in
            </Button>
            <Button component={Link} to="/signup" variant="contained">
              Sign up
            </Button>
            <Button disabled variant="text">
              Continue as guest
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default HomePage
