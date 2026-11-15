import {useInitViewState, usePaging} from '../..';
import {useProject, useInitProjectSave} from '../../project';
import {useInitWorkspacePaging} from './useInitWorkspacePaging';
import type {WorkspaceState} from '../states/WorkspaceState';

export function useInitWorkspace(): WorkspaceState {
    const viewState = useInitViewState();
    const projectState = useProject();
    const pagingState = usePaging(projectState.pages.length);
    const paging = useInitWorkspacePaging(pagingState, projectState);
    const saveState = useInitProjectSave(viewState, projectState);
    return {viewState, workspacePaging: paging, saveState};
}
