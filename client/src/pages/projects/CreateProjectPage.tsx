import {useSubmitting} from '../../hooks/form';
import {FormProvider} from '../../components/formComponents/FormProvider';
import {Stack, Typography} from '@mui/material'
import {useCreateProject} from '../../hooks/project';
import {PdfFileField} from '../../components/PdfFileField.tsx'
import Form from '../../components/formComponents/Form.tsx'
import FormPage from '../../components/formComponents/FormPage.tsx'
import NameField from "../../components/formComponents/NameField.tsx";
import ScoreDetailField from '../../components/formComponents/ScoreDetailField.tsx';
import LayoutTrainingPermissionField from '../../components/formComponents/LayoutTrainingPermissionField.tsx';

export default function CreateProjectPage() {
    return <FormProvider><CreateProjectContent/></FormProvider>;
}

function CreateProjectContent() {
    const model = useCreateProject()
    const {isSubmitting} = useSubmitting()
    return (
        <FormPage title="Create project">
            <Form
                submitButtonText={isSubmitting ? 'Creating project…' : 'Create project'}
                state={model}
            >
                <Stack spacing={3}>
                    <NameField label="Project name" state={model}
                               required disabled={isSubmitting} autoComplete="project-name"/>
                    <ScoreDetailField label="Title" field="title" state={model} required disabled={isSubmitting}/>
                    <ScoreDetailField label="Subtitle" field="subtitle" state={model} disabled={isSubmitting}/>
                    <ScoreDetailField label="Author" field="author" state={model} disabled={isSubmitting}/>
                    <Stack direction="row" spacing={2}>
                        <ScoreDetailField label="Author date" field="authorDate" state={model} disabled={isSubmitting}/>
                        <ScoreDetailField label="Genre" field="genre" state={model} disabled={isSubmitting}/>
                    </Stack>
                    <PdfFileField disabled={isSubmitting} state={model}/>
                    <LayoutTrainingPermissionField state={model} disabled={isSubmitting}/>
                    {model.progress && <Typography role="status" variant="body2">{model.progress}</Typography>}
                </Stack>
            </Form>
        </FormPage>
    )
}
