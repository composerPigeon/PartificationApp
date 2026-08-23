import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {serverProxy} from "../../server_proxy/ServerProxy.ts";

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await serverProxy.executeLogin(email, password)

      if (!result.ok && result.error) {
        setError(result.error)
      }

      await navigate({ to: '/profile' })
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to log in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="main" sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Log in
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome back to Partification
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              autoComplete="email"
              autoFocus
              disabled={isSubmitting}
              fullWidth
              id="email"
              label="Email address"
              margin="normal"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <TextField
              autoComplete="current-password"
              disabled={isSubmitting}
              fullWidth
              id="password"
              label="Password"
              margin="normal"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <Button
              disabled={isSubmitting || !email.trim() || !password}
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </Button>
          </Box>

          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            Don&apos;t have an account?{' '}
            <MuiLink component={Link} to="/signup">
              Sign up
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
