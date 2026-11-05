import {createContext, useContext} from 'react';
import type {ProjectState} from './states/ProjectState.ts';

export const ProjectContext = createContext<ProjectState | undefined>(undefined);

// Reads the active project session shared by the workspace and export pages.
export function useProjectState(): ProjectState {
    const state = useContext(ProjectContext);
    if (!state) throw new Error('useProjectState must be used within ProjectProvider.');
    return state;
}
