import {useEffect, useEffectEvent, useRef, useState} from 'react';
import {Outlet, useParams} from '@tanstack/react-router';
import {Alert, Button, CircularProgress, Container} from '@mui/material';
import type {Project, ScorePage} from '../../domain';
import {projectManager} from '../../services';
import {useBaseState, usePaging} from '../../hooks';
import {ProjectProvider} from './ProjectProvider.tsx';
import {ProjectPage} from './ProjectPage.tsx';

export function ProjectRouter() {
    const {projectName} = useParams({from: '/$userId/$projectName'});
    const state = useBaseState();
    const [project, setProject] = useState<Project | null>(null);
    const [pages, setPages] = useState<ScorePage[]>([]);
    const loading = useRef<AbortController | null>(null);

    async function loadProject() {
        loading.current?.abort();
        const controller = new AbortController();
        loading.current = controller;
        setProject(null);
        // eslint-disable-next-line react-hooks/immutability -- The accessor delegates to React's state setter.
        state.error = null;
        try {
            const project = await projectManager.loadProject(projectName);
            if (controller.signal.aborted) return;
            const pages = await projectManager.loadPages(project);
            if (!controller.signal.aborted) {
                setPages(pages);
                setProject(project);
            }
        } catch (error) {
            if (!controller.signal.aborted) state.error = error instanceof Error ? error.message : 'Unable to load project.';
        }
    }

    // eslint-disable-next-line react-hooks/immutability -- loadProject updates error through a React state accessor.
    const loadOnOpen = useEffectEvent(loadProject);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Starting a new load clears the previous project and error.
        void loadOnOpen();
        return () => { loading.current?.abort(); };
    }, [projectName]);

    if (state.error) return <ProjectStatus projectName={projectName} error={state.error} onRetry={loadProject}/>;
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
