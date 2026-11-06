import type {PropsWithChildren} from 'react';
import type {Project, ScorePage} from '../../domain';
import {ProjectContext, useInitProject} from '../../hooks/project';

interface ProjectProviderProps {
    project: Project;
    pages: ScorePage[];
}

export function ProjectProvider({project, pages, children}: PropsWithChildren<ProjectProviderProps>) {
    const state = useInitProject(project, pages);
    return (
        <ProjectContext.Provider value={state}>
            {children}
        </ProjectContext.Provider>
    );
}
