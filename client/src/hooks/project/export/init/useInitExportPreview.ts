import {useEffect, useEffectEvent, useState} from 'react';
import {exportPdfService} from '../../../../services';
import type {ProjectState, ProjectSaveState} from '../..';
import type {ViewState} from '../../../states';

export function useInitExportPreview({project}: ProjectState, save: ProjectSaveState,
    view: ViewState, selectedIds: ReadonlySet<string>) {
    const [result, setResult] = useState<{project: typeof project; selectedIds: ReadonlySet<string>; pdf: Blob | null; generating: boolean}>(
        {project, selectedIds, pdf: null, generating: false});
    const current = result.project === project && result.selectedIds === selectedIds;

    const generate = useEffectEvent(async (signal: AbortSignal) => {
        // eslint-disable-next-line react-hooks/immutability -- View accessors delegate to React state setters.
        view.error = null;
        setResult({project, selectedIds, pdf: null, generating: selectedIds.size > 0});
        if (!selectedIds.size) return;
        try {
            if (!await save.save()) throw new Error('Save the project successfully before exporting.');
            if (signal.aborted) return;
            const instruments = project.instruments.filter(instrument => selectedIds.has(instrument.id));
            const pdf = await exportPdfService.createPdf(project, instruments);
            if (!signal.aborted) setResult({project, selectedIds, pdf, generating: false});
        } catch (error) {
            if (!signal.aborted) {
                view.error = error instanceof Error ? error.message : 'Unable to generate PDF preview.';
                setResult({project, selectedIds, pdf: null, generating: false});
            }
        }
    });

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize the generated PDF with instrument selection.
        void generate(controller.signal);
        return () => controller.abort();
    }, [project, selectedIds]);

    return {pdf: current ? result.pdf : null, generating: current ? result.generating : selectedIds.size > 0};
}
export type ExportPreviewState = ReturnType<typeof useInitExportPreview>;
