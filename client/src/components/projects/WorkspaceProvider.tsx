import {ViewContext} from '../../hooks/useView';
import type {PropsWithChildren} from 'react';
import {WorkspaceContext, useInitWorkspace} from '../../hooks/project/workspace';

export function WorkspaceProvider({children}: PropsWithChildren) {
    const state = useInitWorkspace();
    return <ViewContext.Provider value={state.viewState}>
        <WorkspaceContext.Provider value={state}>{children}</WorkspaceContext.Provider>
    </ViewContext.Provider>;
}
