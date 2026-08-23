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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { serverProxy } from '../../server_proxy/ServerProxy.ts'

function SignUpPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = event.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await serverProxy.executeSignup(
        email.trim(),
        password,
        firstName.trim(),
        lastName.trim(),
      )

      if (!result.ok) {
        setError(result.error ?? 'Unable to create your account.')
        return
      }

      await navigate({ to: '/login' })
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to create your account. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isIncomplete = Boolean(
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword,
  )

  return (
    <Box component="main" sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create an account
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
            Start using Partification
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ sm: 2 }}>
              <TextField
                autoComplete="given-name"
                autoFocus
                disabled={isSubmitting}
                fullWidth
                slotProps={{ htmlInput: { minLength: 3, maxLength: 80 } }}
                label="First name"
                margin="normal"
                name="firstName"
                onChange={(event) => setFirstName(event.target.value)}
                required
                value={firstName}
              />
              <TextField
                autoComplete="family-name"
                disabled={isSubmitting}
                fullWidth
                slotProps={{ htmlInput: { minLength: 3, maxLength: 80 } }}
                label="Last name"
                margin="normal"
                name="lastName"
                onChange={(event) => setLastName(event.target.value)}
                required
                value={lastName}
              />
            </Stack>
            <TextField
              autoComplete="email"
              disabled={isSubmitting}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 120 } }}
              label="Email address"
              margin="normal"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <TextField
              autoComplete="new-password"
              disabled={isSubmitting}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 1024 } }}
              label="Password"
              margin="normal"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <TextField
              autoComplete="new-password"
              disabled={isSubmitting}
              error={Boolean(confirmPassword) && password !== confirmPassword}
              fullWidth
              helperText={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match.'
                  : ' '
              }
              label="Confirm password"
              margin="normal"
              name="confirmPassword"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
            <Button
              disabled={isSubmitting || isIncomplete}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              type="submit"
              variant="contained"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Box>

          <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login">
              Log in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default SignUpPage
