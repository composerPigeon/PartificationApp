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
import type { ProfileResponse } from '../../server_proxy/responses'

function isProfileResponse(value: unknown): value is ProfileResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'first_name' in value &&
    typeof value.first_name === 'string' &&
    'last_name' in value &&
    typeof value.last_name === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'created_at' in value &&
    typeof value.created_at === 'string'
  )
}

function getErrorMessage(value: unknown): string | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return value.message
  }

  return null
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)
}

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/settings/profile', {
        credentials: 'include',
        signal,
      })

      if (response.status === 401) {
        await navigate({ to: '/login' })
        return
      }

      const body: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getErrorMessage(body) ?? 'Unable to load your profile.')
      }

      if (!isProfileResponse(body)) {
        throw new Error('The server returned an invalid profile response.')
      }

      setProfile(body)
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
                    {profile.first_name} {profile.last_name}
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
                  <Typography>{formatCreatedAt(profile.created_at)}</Typography>
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
