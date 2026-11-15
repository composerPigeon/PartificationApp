import {useInitViewState} from '../../..';
import {useProject, useInitProjectSave} from '../..';
import {useInitInstrumentSelection} from './useInitInstrumentSelection';
import {useInitExportPreview} from './useInitExportPreview';
import {useInitBrowserPreview} from './useInitBrowserPreview';
import type {ExportState} from '../states/ExportState';

export function useInitExport(): ExportState {
    const viewState = useInitViewState();
    const projectState = useProject();
    const saveState = useInitProjectSave(viewState, projectState);
    const instrumentSelection = useInitInstrumentSelection();
    const preview = useInitExportPreview(projectState, saveState, viewState, instrumentSelection.selectedIds);
    const browserPreview = useInitBrowserPreview(preview.pdf);
    return {viewState, saveState, instrumentSelection, preview, browserPreview};
}
