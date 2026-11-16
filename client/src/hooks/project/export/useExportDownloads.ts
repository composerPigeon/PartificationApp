import {useRef, useState} from 'react';
import {ExportContext} from '../../../domain';
import {exportPdfService, projectManager} from '../../../services';
import {downloadFile} from '../../../services/pdf/export/downloadFile';
import {createExportArchive} from '../../../services/pdf/export/createExportArchive';
import {useProject} from '..';
import {useExport} from './useExport';

export function useExportDownloads() {
    const {project} = useProject();
    const {saveState, viewState} = useExport();
    const [downloading, setDownloading] = useState(false);
    const active = useRef(false);

    async function download(selectedIds: ReadonlySet<string>): Promise<void> {
        if (active.current) return;
        const contexts = project.exports.filter(context => selectedIds.has(context.id))
            .map(context => Object.assign(new ExportContext([...context.instrumentIds]), context));
        if (!contexts.length) return;
        active.current = true;
        setDownloading(true);
        // eslint-disable-next-line react-hooks/immutability -- View accessors delegate to React state setters.
        viewState.error = null;
        try {
            if (!await saveState.save()) throw new Error('Save the project successfully before downloading.');
            await projectManager.saveProject(project, []);
            const files: {pdf: Blob; fileName: string}[] = [];
            for (const context of contexts) {
                const pdf = await exportPdfService.createPdf(project, context);
                files.push({pdf, fileName: `${project.projectName}_${context.id}.pdf`});
            }
            if (files.length === 1) {
                downloadFile(files[0].pdf, files[0].fileName);
            } else {
                const archive = await createExportArchive(files);
                downloadFile(archive, `${project.projectName}_exports.zip`);
            }
        } catch (error) {
            viewState.error = error instanceof Error ? error.message : 'Unable to download exports.';
        } finally {
            active.current = false;
            setDownloading(false);
        }
    }

    return {downloading, download};
}
