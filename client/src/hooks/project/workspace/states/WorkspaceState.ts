import type {ViewState} from '../../../states';
import type {ProjectSaveState} from '../..';
import type {WorkspacePagingState} from './WorkspacePagingState';

export interface WorkspaceState {
    viewState: ViewState;
    workspacePaging: WorkspacePagingState;
    saveState: ProjectSaveState;
}
