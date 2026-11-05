import type {PropsWithChildren} from 'react';
import type {Project, ScorePage} from '../../domain';
import {ProjectContext} from '../../hooks/projects/useProjectState.ts';
import {useInitProjectState} from '../../hooks/projects/init/useInitProjectState.ts';

interface ProjectProviderProps {
    project: Project;
    pages: ScorePage[];
}

export function ProjectProvider({project, pages, children}: PropsWithChildren<ProjectProviderProps>) {
    const state = useInitProjectState(project, pages);
    return (
        <ProjectContext.Provider value={state}>
            {children}
        </ProjectContext.Provider>
    );
}
