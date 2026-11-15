import {Outlet} from '@tanstack/react-router';
import {Alert, Button, CircularProgress, Container} from '@mui/material';
import {useProjectLoading} from '../../hooks/project';
import {ProjectProvider} from './ProjectProvider.tsx';
import {ProjectPage} from './ProjectPage.tsx';

export function ProjectRouter() {
    const {projectName, project, pages, error, retry} = useProjectLoading();

    if (error) return <ProjectStatus projectName={projectName} error={error} onRetry={retry}/>;
    if (!project || project.projectName !== projectName) return <ProjectStatus projectName={projectName}/>;

    return <ProjectProvider key={project.id} project={project} pages={pages}>
        <Outlet/>
    </ProjectProvider>;
}

function ProjectStatus({projectName, error, onRetry}: {projectName: string; error?: string; onRetry?(): void}) {
    return <ProjectPage title={error ? 'Project error' : 'Loading project'} projectTitle={projectName}>
        <Container maxWidth="sm" sx={{py: 4}}>
            <Alert severity={error ? 'error' : 'info'} role={error ? 'alert' : 'status'}
                   icon={error ? undefined : <CircularProgress size={18} aria-label="Loading project"/>}
                   action={error && <Button color="inherit" onClick={onRetry}>Retry</Button>}>
                {error || 'Loading project…'}
            </Alert>
        </Container>
    </ProjectPage>;
}
