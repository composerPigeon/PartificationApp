import type {ScorePage} from '../../../../domain';
import {useProject} from '../..';
import {useWorkspace} from '../useWorkspace';
import {useInitInteractionMode, useInitScorePageDomain, useInitStaffSelection, useInitStaffCreation, useInitStaffDragging, useInitInstrumentEditing} from '../scorePage';
import {useInitInteractionActivity} from './useInitInteractionActivity';
import {useInitPermissions} from './useInitPermissions';
import type {WorkspacePageState} from '../states/WorkspacePageState';

export function useInitWorkspacePage(page: ScorePage): WorkspacePageState {
    const projectState = useProject();
    const {viewState, saveState, workspacePaging: paging} = useWorkspace();
    const activity = useInitInteractionActivity();
    const permissions = useInitPermissions(page, activity);
    const selection = useInitStaffSelection(activity, permissions);
    const interactionMode = useInitInteractionMode(selection, permissions);
    const domain = useInitScorePageDomain(viewState, projectState, paging, saveState, page);
    const staffDragging = useInitStaffDragging(domain, permissions);
    const instrumentEditing = useInitInstrumentEditing(projectState, domain, interactionMode, selection, permissions, activity, page);
    const staffCreation = useInitStaffCreation(projectState, domain, interactionMode, permissions, instrumentEditing, activity, page);

    function deleteStaff(id: number): boolean {
        if (!permissions.canChangeTool || !domain.deleteStaff(id)) return false;
        selection.clear(id);
        instrumentEditing.cancelInstrument(id);
        staffDragging.clearPreview(id);
        return true;
    }

    return {currentPage: page, permissions, instrumentEditing, staffCreation, staffDragging, selection, interactionMode, domain, deleteStaff};
}
