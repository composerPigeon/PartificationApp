import {createContext, useContext} from 'react';
import type {ProjectState} from './states';

export const ProjectContext = createContext<ProjectState | undefined>(undefined);

// Reads the active project session shared by the workspace and export pages.
export function useProject(): ProjectState {
    const state = useContext(ProjectContext);
    if (!state) throw new Error('useProject must be used within ProjectProvider.');
    return state;
}
