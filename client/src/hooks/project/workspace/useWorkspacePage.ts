import {createContext, useContext} from 'react';
import type {WorkspacePageState} from './states/WorkspacePageState';

export const WorkspacePageContext = createContext<WorkspacePageState | undefined>(undefined);

export function useWorkspacePage(): WorkspacePageState {
    const state = useContext(WorkspacePageContext);
    if (!state) throw new Error('useWorkspacePage must be used within WorkspacePageProvider.');
    return state;
}
