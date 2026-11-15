import type {ViewState, PagingState} from '../../states';

import type {ProjectSaveState} from '../../project';

export interface ExportState {
    viewState: ViewState;
    paging: PagingState;
    saveState: ProjectSaveState;
}
