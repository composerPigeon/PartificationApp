import {useInitViewState} from '../../..';
import {useProject, useInitProjectSave} from '../..';
import {useInitInstrumentSelection} from './useInitInstrumentSelection';
import {useInitExportPreview} from './useInitExportPreview';
import {useInitBrowserPreview} from './useInitBrowserPreview';
import type {ExportState} from '../states/ExportState';
import {useInitExportInteractionMode} from './useInitExportInteractionMode';
import {useState} from 'react';
import {projectManager} from '../../../../services';

export function useInitExport(): ExportState {
    const [deletingExport, setDeletingExport] = useState(false);
    const interactionMode = useInitExportInteractionMode();
    const viewState = useInitViewState();
    const projectState = useProject();
    const saveState = useInitProjectSave(viewState, projectState);
    const instrumentSelection = useInitInstrumentSelection();
    const preview = useInitExportPreview(projectState, saveState, viewState, instrumentSelection.selectedIds);
    const browserPreview = useInitBrowserPreview(preview.pdf);
    async function deleteExport(exportId: string): Promise<void> {
        if (deletingExport) return;
        const {project} = projectState;
        const index = project.exports.findIndex(context => context.id === exportId);
        if (index < 0) return;
        const context = project.exports[index];
        if (!project.deleteExportContext(exportId)) return;
        if (context.instrumentIds.length === instrumentSelection.selectedIds.size
            && context.instrumentIds.every(id => instrumentSelection.selectedIds.has(id))) {
            instrumentSelection.select([]);
        }
        setDeletingExport(true);
        try {
            await projectManager.saveProject(project, []);
        } catch (error) {
            project.exports.splice(index, 0, context);
            // eslint-disable-next-line react-hooks/immutability -- View accessors delegate to React state setters.
            viewState.error = error instanceof Error ? error.message : 'Unable to delete export.';
        } finally {
            setDeletingExport(false);
        }
    }
    return {interactionMode, viewState, saveState, instrumentSelection, preview, browserPreview, deleteExport, deletingExport};
}
