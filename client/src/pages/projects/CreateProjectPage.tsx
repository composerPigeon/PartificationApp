import { Link } from '@tanstack/react-router'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { useCreateProject } from '../../hooks/useCreateProject.ts'
import { PdfFileField } from '../../components/PdfFileField.tsx'
import Form from '../../components/formComponents/Form.tsx'
import FormPage from '../../components/formComponents/FormPage.tsx'
import FormTitle from '../../components/formComponents/FormTitle.tsx'
import NameField from "../../components/formComponents/NameField.tsx";

export default function CreateProjectPage() {
  const model = useCreateProject()
  return (
    <FormPage>
      <FormTitle>Create project</FormTitle>
      <Form
        submitButtonText={model.busy ? 'Creating project…' : 'Create project'}
        isBusy={model.busy}
        isFormIncomplete={!model.file || !model.name.trim()}
        handleSubmit={model.submit}
      >
        <Stack spacing={3}>
          <Typography color="text.secondary">Name your project and choose the PDF you want to work with.</Typography>
          {model.error && <Alert severity="error">{model.error}</Alert>}
          <NameField label="Project name" value={model.name} setValue={model.setName}
            required disabled={model.busy} autoComplete="project-name" />
          <PdfFileField disabled={model.busy} onChange={model.chooseFile} />
          <Typography role="status" variant="body2">{model.progress}</Typography>
        </Stack>
      </Form>
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Button component={Link} to="/projects" disabled={model.busy}>Back to projects</Button>
        <Button component={Link} to="/login" disabled={model.busy}>Choose project folder</Button>
      </Stack>
    </FormPage>
  )
}
