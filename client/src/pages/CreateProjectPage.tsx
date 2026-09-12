import { Link } from '@tanstack/react-router'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { useCreateProject } from '../hooks/useCreateProject'

export default function CreateProjectPage() {
  const model = useCreateProject()
  return (
    <Box component="main" sx={{ minHeight: '100svh', py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Stack component="form" spacing={3} onSubmit={model.submit}>
            <Box>
              <Typography component="h1" variant="h4">Create project</Typography>
              <Typography color="text.secondary">Name your project and choose the PDF you want to work with.</Typography>
            </Box>
            {model.error && <Alert severity="error">{model.error}</Alert>}
            <TextField label="Project name" value={model.name} required fullWidth autoFocus
              disabled={model.busy} onChange={event => model.setName(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 120 } }} />
            <Box>
              <Typography component="label" htmlFor="project-pdf" sx={{ display: 'block' }} gutterBottom>PDF file</Typography>
              <input id="project-pdf" type="file" accept=".pdf,application/pdf" required
                disabled={model.busy} style={{ maxWidth: '100%' }}
                onChange={event => model.chooseFile(event.target.files?.[0] ?? null)} />
              {model.file && <Typography variant="body2" sx={{ mt: 1, overflowWrap: 'anywhere' }}>{model.file.name}</Typography>}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The PDF and converted pages will be saved in your selected project folder.
              </Typography>
            </Box>
            <Typography role="status" variant="body2">{model.progress}</Typography>
            <Button type="submit" variant="contained" disabled={model.busy || !model.file || !model.name.trim()}>
              {model.busy ? 'Creating project…' : 'Create project'}
            </Button>
            <Button component={Link} to="/projects" disabled={model.busy}>Back to projects</Button>
            <Button component={Link} to="/login" disabled={model.busy}>Choose project folder</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
