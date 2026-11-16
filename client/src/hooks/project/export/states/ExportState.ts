import type {ViewState} from '../../../states';
import type {ProjectSaveState} from '../..';
import type {InstrumentSelectionState} from '../init/useInitInstrumentSelection';
import type {ExportPreviewState} from '../init/useInitExportPreview';
import type {BrowserPreviewState} from '../init/useInitBrowserPreview';
import type {ExportInteractionModeState} from './ExportInteractionModeState';

export interface ExportState {
    interactionMode: ExportInteractionModeState;
    viewState: ViewState;
    saveState: ProjectSaveState;
    instrumentSelection: InstrumentSelectionState;
    preview: ExportPreviewState;
    browserPreview: BrowserPreviewState;
}
