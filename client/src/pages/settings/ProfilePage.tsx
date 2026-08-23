import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { ProfileData } from '../../server_proxy/responses'
import {serverProxy} from "../../server_proxy/ServerProxy.ts";

function formatCreatedAt(value?: Date | string): string {
  if (value === undefined) {
    return 'Unknown'
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)
}

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await serverProxy.getProfile()

      if (!result.ok && result.error) {
        setError(result.error)
      }

      /*
      if (result.status === 401) {
        await navigate({ to: '/login' })
        return
      }
      */

      setProfile(result)
    } catch (caughtError) {
      if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
        return
      }

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load your profile.',
      )
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [navigate])

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      void loadProfile(controller.signal)
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [loadProfile])

  return (
    <Box component="main" sx={{ minHeight: '100svh', py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
              Your profile
            </Typography>
            <Typography color="text.secondary">
              Your Partification account details
            </Typography>
          </Box>

          {isLoading && (
            <Paper sx={{ p: 6, display: 'grid', placeItems: 'center' }}>
              <CircularProgress aria-label="Loading profile" />
            </Paper>
          )}

          {!isLoading && error && (
            <Alert
              severity="error"
              action={<Button color="inherit" onClick={() => void loadProfile()}>Retry</Button>}
            >
              {error}
            </Alert>
          )}

          {!isLoading && profile && (
            <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
              <Stack spacing={2.5} divider={<Divider flexItem />}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="h6">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email address
                  </Typography>
                  <Typography>{profile.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member since
                  </Typography>
                  <Typography>{formatCreatedAt(profile.createdAt)}</Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Button component={Link} to="/" sx={{ alignSelf: 'flex-start' }}>
            Back to home
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default ProfilePage
