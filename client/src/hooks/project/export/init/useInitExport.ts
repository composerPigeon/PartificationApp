import {useInitViewState, usePaging} from '../../..';
import {useProject, useInitProjectSave} from '../..';
import type {ExportState} from '../states/ExportState';

export function useInitExport(): ExportState {
    const viewState = useInitViewState();
    const paging = usePaging();
    const projectState = useProject();
    const saveState = useInitProjectSave(viewState, projectState);
    return {viewState, paging, saveState};
}
