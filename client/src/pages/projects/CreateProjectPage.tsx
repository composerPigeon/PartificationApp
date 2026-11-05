import {Alert, Stack, Typography} from '@mui/material'
import {useCreateProject} from '../../hooks/projects/useCreateProject.ts'
import {PdfFileField} from '../../components/PdfFileField.tsx'
import Form from '../../components/formComponents/Form.tsx'
import FormPage from '../../components/formComponents/FormPage.tsx'
import NameField from "../../components/formComponents/NameField.tsx";
import ScoreDetailField from '../../components/formComponents/ScoreDetailField.tsx';
import LayoutTrainingPermissionField from '../../components/formComponents/LayoutTrainingPermissionField.tsx';

export default function CreateProjectPage() {
    const model = useCreateProject()
    return (
        <FormPage title="Create project">
            <Form
                submitButtonText={model.isSubmitting ? 'Creating project…' : 'Create project'}
                isBusy={model.isSubmitting}
                isFormIncomplete={model.isIncomplete}
                handleSubmit={model.handleCreateProject}
            >
                <Stack spacing={3}>
                    {model.error && <Alert severity="error">{model.error}</Alert>}
                    <NameField label="Project name" state={model}
                               required disabled={model.isSubmitting} autoComplete="project-name"/>
                    <ScoreDetailField label="Title" field="title" state={model} required disabled={model.isSubmitting}/>
                    <ScoreDetailField label="Subtitle" field="subtitle" state={model} disabled={model.isSubmitting}/>
                    <ScoreDetailField label="Author" field="author" state={model} disabled={model.isSubmitting}/>
                    <Stack direction="row" spacing={2}>
                        <ScoreDetailField label="Author date" field="authorDate" state={model} disabled={model.isSubmitting}/>
                        <ScoreDetailField label="Genre" field="genre" state={model} disabled={model.isSubmitting}/>
                    </Stack>
                    <PdfFileField disabled={model.isSubmitting} state={model}/>
                    <LayoutTrainingPermissionField state={model} disabled={model.isSubmitting}/>
                    {model.progress && <Typography role="status" variant="body2">{model.progress}</Typography>}
                </Stack>
            </Form>
        </FormPage>
    )
}
