import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Box,
  Container,
  Link as MuiLink,
  Paper,
  Typography,
} from '@mui/material'
import {serverProxy} from "../../server_proxy/ServerProxy.ts";
import { projectManager } from '../../projects/ProjectManager'
import type { DirectoryState } from '../../projects/ProjectManager'
import DirectoryPicker from "../../components/DirectoryPicker.tsx";
import EmailField from "../../components/auth/EmailField.tsx";
import Form from "../../components/Form.tsx";
import PasswordField from "../../components/auth/PasswordField.tsx";
import { ActionButton } from '../../components/buttons/ActionButton'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [directory, setDirectory] = useState<DirectoryState | null>(null)
  const [directoryError, setDirectoryError] = useState<string | null>(null)
  const supportsDirectoryPicker = projectManager.supportsDirectoryPicker()
  const [directoryBusy, setDirectoryBusy] = useState(supportsDirectoryPicker)

  useEffect(() => {
    let active = true
    if (!supportsDirectoryPicker) return
    projectManager.restoreDirectory()
      .then((value) => { if (active) setDirectory(value) })
      .catch(() => { if (active) setDirectoryError('Unable to restore your saved folder. Please choose it again.') })
      .finally(() => { if (active) setDirectoryBusy(false) })
    return () => { active = false }
  }, [supportsDirectoryPicker])

  async function handleDirectory(reconnect: boolean) {
    setDirectoryBusy(true)
    setDirectoryError(null)
    try {
      if (reconnect) await projectManager.requestDirectoryAccess()
      else await projectManager.selectDirectory()
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setDirectoryError(error instanceof Error ? error.message : 'Unable to select the folder.')
      }
    } finally {
      try {
        setDirectory(await projectManager.getDirectoryState())
      } catch {
        setDirectoryError('Unable to check folder access. Please choose the folder again.')
      }
      setDirectoryBusy(false)
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (directoryBusy || !directory?.granted || isSubmitting) return
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await serverProxy.executeLogin(email, password)

      if (!result.ok) {
        setError(result.error ?? 'Unable to log in. Please try again.')
        return
      }

      await navigate({ to: '/projects' })
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

  async function handleGuest() {
    if (directoryBusy || !directory?.granted || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const currentDirectory = await projectManager.getDirectoryState()
      if (!currentDirectory?.granted) {
        setDirectory(currentDirectory)
        setDirectoryError('Select a folder and allow access before continuing.')
        return
      }
      await navigate({ to: '/projects' })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to continue as guest.')
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

          <DirectoryPicker
              directoryBusy={directoryBusy}
              directory={directory}
              supportsDirectoryPicker={supportsDirectoryPicker}
              isSubmitting={isSubmitting}
              directoryError={directoryError}
              handleDirectory={handleDirectory}/>

          <Form submitButtonText="Log in" submittingText="Logging in…" noValidate isSubmitting={isSubmitting} isSubmitButtonDisabled={directoryBusy || !directory?.granted || !email.trim() || !password} handleSubmit={handleSubmit}>
              <EmailField autoFocus setValue={setEmail} value={email}/>
              <PasswordField setValue={setPassword} value={password}/>
          </Form>

          <ActionButton fullWidth sx={{ mt: 2 }} busy={isSubmitting}
            disabled={directoryBusy || !directory?.granted}
            onClick={() => void handleGuest()}>
            Continue as guest
          </ActionButton>
          {!directory?.granted && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Select a project folder and allow access to continue.
            </Typography>
          )}

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
