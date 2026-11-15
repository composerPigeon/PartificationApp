import type {ViewState} from '../../../states';
import type {ProjectSaveState} from '../..';
import type {InstrumentSelectionState} from '../init/useInitInstrumentSelection';
import type {ExportPreviewState} from '../init/useInitExportPreview';
import type {BrowserPreviewState} from '../init/useInitBrowserPreview';

export interface ExportState {
    viewState: ViewState;
    saveState: ProjectSaveState;
    instrumentSelection: InstrumentSelectionState;
    preview: ExportPreviewState;
    browserPreview: BrowserPreviewState;
}
