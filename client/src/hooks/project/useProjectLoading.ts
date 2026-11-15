import {useEffect, useEffectEvent, useRef, useState} from 'react';
import {useParams} from '@tanstack/react-router';
import type {Project, ScorePage} from '../../domain';
import {projectManager} from '../../services';
import {useInitViewState} from '../init/useInitViewState';

export function useProjectLoading() {
    const {projectName} = useParams({from: '/$userId/$projectName'});
    const state = useInitViewState();
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

    return {projectName, project, pages, error: state.error, retry: loadProject};
}
