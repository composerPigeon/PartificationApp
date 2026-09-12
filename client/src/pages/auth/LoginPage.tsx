import { useEffect, useState } from 'react'
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
import { projectManager } from '../../projects/ProjectManager'
import type { DirectoryState } from '../../projects/ProjectManager'

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

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Project folder</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }} aria-live="polite">
              {directoryBusy ? 'Checking folder…' : directory
                ? `${directory.name}${directory.granted ? '' : ' — access required'}`
                : 'Choose where your project images will be saved.'}
            </Typography>
            {supportsDirectoryPicker ? (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button type="button" variant="outlined" disabled={directoryBusy || isSubmitting}
                  onClick={() => void handleDirectory(false)}>
                  {directory ? 'Change folder' : 'Choose folder'}
                </Button>
                {directory && !directory.granted && (
                  <Button type="button" disabled={directoryBusy || isSubmitting}
                    onClick={() => void handleDirectory(true)}>
                    Allow access
                  </Button>
                )}
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>Folder selection is unavailable in this browser. Try desktop Chrome or Edge.</Alert>
            )}
            {directoryError && <Alert severity="warning" sx={{ mt: 1 }}>{directoryError}</Alert>}
          </Box>

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
              disabled={isSubmitting || directoryBusy || !directory?.granted || !email.trim() || !password}
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </Button>
          </Box>

          <Button fullWidth type="button" variant="outlined" sx={{ mt: 2 }}
            disabled={isSubmitting || directoryBusy || !directory?.granted}
            onClick={() => void handleGuest()}>
            Continue as guest
          </Button>
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
