import {useInitViewState} from '../../..';
import {useProject, useInitProjectSave} from '../..';
import {useInitInstrumentSelection} from './useInitInstrumentSelection';
import {useInitExportPreview} from './useInitExportPreview';
import {useInitBrowserPreview} from './useInitBrowserPreview';
import type {ExportState} from '../states/ExportState';
import {useInitExportInteractionMode} from './useInitExportInteractionMode';

export function useInitExport(): ExportState {
    const interactionMode = useInitExportInteractionMode();
    const viewState = useInitViewState();
    const projectState = useProject();
    const saveState = useInitProjectSave(viewState, projectState);
    const instrumentSelection = useInitInstrumentSelection();
    const preview = useInitExportPreview(projectState, saveState, viewState, instrumentSelection.selectedIds);
    const browserPreview = useInitBrowserPreview(preview.pdf);
    return {interactionMode, viewState, saveState, instrumentSelection, preview, browserPreview};
}
