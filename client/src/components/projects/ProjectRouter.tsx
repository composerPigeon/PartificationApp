import {useEffect, useEffectEvent, useState} from 'react';
import {Outlet, useParams} from '@tanstack/react-router';
import {Alert, Button, CircularProgress, Container} from '@mui/material';
import type {Project, ScorePage} from '../../domain';
import {projectManager} from '../../services';
import {useBaseState} from '../../hooks/useBaseState.ts';
import {usePaging} from '../../hooks/usePaging.ts';
import {ProjectProvider} from './ProjectProvider.tsx';
import {ProjectPage} from './ProjectPage.tsx';

export function ProjectRouter() {
    const {projectName} = useParams({from: '/$userId/$projectName'});
    const state = useBaseState();
    const [project, setProject] = useState<Project | null>(null);
    const [pages, setPages] = useState<ScorePage[]>([]);
    const reportError = useEffectEvent((error: string | null) => {
        // eslint-disable-next-line react-hooks/immutability -- The accessor delegates to React's state setter.
        state.error = error;
    });

    useEffect(() => {
        let active = true;

        async function loadProject() {
            setProject(null);
            reportError(null);
            try {
                const project = await projectManager.loadProject(projectName);
                if (!active) return;
                const pages = await projectManager.loadPages(project);
                if (active) {
                    setPages(pages);
                    setProject(project);
                }
            } catch (error) {
                if (active) reportError(error instanceof Error ? error.message : 'Unable to load project.');
            }
        }

        void loadProject();
        return () => { active = false; };
    }, [projectName, state.revision]);

    if (state.error) return <ProjectStatus projectName={projectName} error={state.error} onRetry={state.refresh}/>;
    if (!project || project.projectName !== projectName) return <ProjectStatus projectName={projectName}/>;

    return <ProjectProvider key={project.id} project={project} pages={pages}>
        <Outlet/>
    </ProjectProvider>;
}

function ProjectStatus({projectName, error, onRetry}: {projectName: string; error?: string; onRetry?(): void}) {
    const paging = usePaging();
    return <ProjectPage title={error ? 'Project error' : 'Loading project'} projectTitle={projectName} pagination={paging}>
        <Container maxWidth="sm" sx={{py: 4}}>
            <Alert severity={error ? 'error' : 'info'} role={error ? 'alert' : 'status'}
                   icon={error ? undefined : <CircularProgress size={18} aria-label="Loading project"/>}
                   action={error && <Button color="inherit" onClick={onRetry}>Retry</Button>}>
                {error || 'Loading project…'}
            </Alert>
        </Container>
    </ProjectPage>;
}
