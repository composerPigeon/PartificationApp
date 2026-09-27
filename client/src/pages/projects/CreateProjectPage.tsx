import { Link } from '@tanstack/react-router'
import { Alert, Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import { useCreateProject } from '../../hooks/useCreateProject.ts'
import { FullField } from '../../components/FullField.tsx'
import { PdfFileField } from '../../components/PdfFileField.tsx'
import { SubmitButton } from '../../components/buttons/SubmitButton.tsx'

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
            <FullField label="Project name" name="projectName" value={model.name} setValue={model.setName}
              autoFocus disabled={model.busy} maxLength={120} />
            <PdfFileField disabled={model.busy} onChange={model.chooseFile} />
            <Typography role="status" variant="body2">{model.progress}</Typography>
            <SubmitButton busy={model.busy} busyLabel="Creating project…" disabled={!model.file || !model.name.trim()}>
              Create project
            </SubmitButton>
            <Button component={Link} to="/projects" disabled={model.busy}>Back to projects</Button>
            <Button component={Link} to="/login" disabled={model.busy}>Choose project folder</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
