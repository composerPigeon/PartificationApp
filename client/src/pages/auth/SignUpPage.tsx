import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Box,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { serverProxy } from '../../server_proxy/ServerProxy.ts'
import Form from "../../components/Form.tsx";
import { FullField } from '../../components/FullField'
import PasswordField from '../../components/auth/PasswordField'
import EmailField from "../../components/auth/EmailField.tsx";

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

          <Form submitButtonText="Create account" submittingText="Creating account…" isSubmitting={isSubmitting} isSubmitButtonDisabled={isIncomplete} handleSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ sm: 2 }}>
              <FullField label="First name" name="firstName" autoComplete="given-name" autoFocus
                minLength={3} maxLength={80} value={firstName} setValue={setFirstName} />
              <FullField label="Last name" name="lastName" autoComplete="family-name"
                minLength={3} maxLength={80} value={lastName} setValue={setLastName} />
            </Stack>
            <EmailField setValue={setEmail} value={email}/>
            <PasswordField newPassword value={password} setValue={setPassword} />
            <PasswordField newPassword label="Confirm password" name="confirmPassword"
              value={confirmPassword} setValue={setConfirmPassword}
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match.' : undefined} />
          </Form>

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
