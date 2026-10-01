import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Alert, Box, Button, CircularProgress, Container, List, ListItem,
  ListItemButton, ListItemText, Paper, Stack, Typography,
} from '@mui/material'
import { projectManager } from '../../services'
import type { Project } from '../../domain/Project.ts'

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const loaded = await projectManager.loadProjects()
        if (active) {
          setProjects(loaded)
        }
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : 'Unable to load projects.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [attempt])

  function retry() {
    setError(null)
    setIsLoading(true)
    setAttempt(value => value + 1)
  }

  return (
    <Box component="main" sx={{ minHeight: '100svh', py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>Projects</Typography>
          </Box>
          <Button component={Link} to="/projects/new" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            Create project
          </Button>
          {isLoading ? (
            <Box sx={{ p: 6, display: 'grid', placeItems: 'center' }}>
              <CircularProgress aria-label="Loading projects" />
            </Box>
          ) : error ? (
            <Alert severity="error" action={<Button color="inherit" onClick={retry}>Retry</Button>}>
              {error}
            </Alert>
          ) : projects.length === 0 ? (
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6">No projects yet</Typography>
              <Typography color="text.secondary">There are no saved projects in this folder.</Typography>
            </Paper>
          ) : (
            <Paper variant="outlined">
              <List aria-label="Projects" disablePadding>
                {projects.map((project, index) => (
                  <ListItem key={project.id} divider={index < projects.length - 1} disablePadding>
                    <Link to="/projects/$projectId" params={{projectId: project.id}} state={{project}}
                      style={{ width: '100%', color: 'inherit', textDecoration: 'none' }}>
                    <ListItemButton component="span" role={undefined} tabIndex={-1}>
                    <ListItemText
                      primary={project.projectName}
                      secondary={` · ${project.pageCount} ${project.pageCount === 1 ? 'page' : 'pages'}`}
                      sx={{ overflowWrap: 'anywhere' }}
                    />
                    </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
          <Button component={Link} to="/login" sx={{ alignSelf: 'flex-start' }}>
            Back to login
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default ProjectsPage
