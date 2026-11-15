import type {PropsWithChildren} from 'react';
import {WorkspaceContext, useInitWorkspace} from '../../hooks/workspace';

export function WorkspaceProvider({children}: PropsWithChildren) {
    const state = useInitWorkspace();
    return <WorkspaceContext.Provider value={state}>{children}</WorkspaceContext.Provider>;
}
