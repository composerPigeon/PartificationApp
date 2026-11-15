import type {PropsWithChildren} from 'react';
import {WorkspacePageContext, useInitWorkspacePage} from '../../hooks/workspace';
import type {ScorePage} from '../../domain';

// The keyed boundary gives every displayed page fresh editing state.
export function WorkspacePageProvider({page, children}: PropsWithChildren<{page: ScorePage}>) {
    return <PageProvider key={page.projectId + ':' + page.number} page={page}>
        {children}
    </PageProvider>;
}

function PageProvider({page, children}: PropsWithChildren<{page: ScorePage}>) {
    const state = useInitWorkspacePage(page);
    return <WorkspacePageContext.Provider value={state}>{children}</WorkspacePageContext.Provider>;
}
