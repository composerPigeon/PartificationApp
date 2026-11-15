import {createContext, useContext} from 'react';
import type {WorkspaceState} from './states/WorkspaceState';

export const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export function useWorkspace(): WorkspaceState {
    const state = useContext(WorkspaceContext);
    if (!state) throw new Error('useWorkspace must be used within WorkspaceProvider.');
    return state;
}
