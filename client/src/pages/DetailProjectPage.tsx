import { Link, useParams } from '@tanstack/react-router'
import { Alert, Box, Button, CircularProgress, Container, IconButton, Paper, Stack, Typography } from '@mui/material'
import { useProjectDetail } from '../hooks/useProjectDetail'
import { ProjectPageImage } from '../components/projects/ProjectPageImage'

function ProjectDetail({ projectId }: { projectId: string }) {
  const model = useProjectDetail(projectId)
  const image = model.project?.images[model.pageIndex]

  return (
    <Box component="main" sx={{ minHeight: '100svh', bgcolor: 'grey.100', py: 3, pl: { xs: '64px', sm: '88px' }, pr: { xs: 1, sm: 3 } }}>
      <Paper component="aside" aria-label="Project tools" elevation={5}
        sx={{ position: 'fixed', left: { xs: 8, sm: 16 }, top: '75%', transform: 'translateY(-50%)', width: { xs: 40, sm: 56 }, minHeight: 240, borderRadius: 3, zIndex: 10 }} />
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          <Box component="header">
            <Button component={Link} to="/projects">← Projects</Button>
            <Typography component="h1" variant="h4" align="center" sx={{ overflowWrap: 'anywhere', fontWeight: 700 }}>
              {model.project?.name ?? 'Project'}
            </Typography>
          </Box>
          {model.loading ? (
            <Box sx={{ minHeight: '60svh', display: 'grid', placeItems: 'center' }}>
              <CircularProgress aria-label="Loading project" />
            </Box>
          ) : model.error ? (
            <Stack spacing={2}>
              <Alert severity="error" action={<Button color="inherit" onClick={model.retry}>Retry</Button>}>{model.error}</Alert>
              <Button component={Link} to="/login">Choose folder / allow access</Button>
            </Stack>
          ) : model.project && image ? (
            <>
              <Box component="section" aria-label="Project page viewer"
                sx={{ minHeight: 'calc(100svh - 240px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, sm: 2 } }}>
                <ProjectPageImage key={`${projectId}:${image.pageNumber}`} projectId={projectId} image={image} projectName={model.project.name} />
              </Box>
              <Stack component="nav" aria-label="Page navigation" direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <IconButton aria-label="Previous page" disabled={model.pageIndex === 0} onClick={model.previous}>
                  <Box component="span" aria-hidden="true">←</Box>
                </IconButton>
                <Typography role="status">Page {model.pageIndex + 1} of {model.pageCount}</Typography>
                <IconButton aria-label="Next page" disabled={model.pageIndex === model.pageCount - 1} onClick={model.next}>
                  <Box component="span" aria-hidden="true">→</Box>
                </IconButton>
              </Stack>
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}

export default function DetailProjectPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' })
  return <ProjectDetail key={projectId} projectId={projectId} />
}
