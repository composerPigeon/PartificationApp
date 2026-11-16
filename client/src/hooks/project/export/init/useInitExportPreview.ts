import {useEffect, useEffectEvent, useRef, useState} from 'react';
import type {ExportContext, Project} from '../../../../domain';
import {exportPdfService, projectManager} from '../../../../services';
import type {ProjectState, ProjectSaveState} from '../..';
import type {ViewState} from '../../../states';

export function useInitExportPreview({project}: ProjectState, save: ProjectSaveState,
    view: ViewState, selectedIds: ReadonlySet<string>) {
    const [settingsRevision, setSettingsRevision] = useState(0);
    const dirtyContexts = useRef(new WeakSet<ExportContext>());
    const previews = useRef(new WeakMap<ExportContext, {project: Project; signature: string; pdf: Blob; maximum: number}>());
    const [spacingLimit, setSpacingLimit] = useState<{project: typeof project; contextId: string; maximum: number} | null>(null);
    const [result, setResult] = useState<{project: typeof project; selectedIds: ReadonlySet<string>; settingsRevision: number; pdf: Blob | null; generating: boolean}>(
        {project, selectedIds, settingsRevision, pdf: null, generating: false});
    const current = result.project === project && result.selectedIds === selectedIds && result.settingsRevision === settingsRevision;
    const instruments = project.instruments.filter(instrument => selectedIds.has(instrument.id));
    const contextId = instruments.map(instrument => instrument.id).sort().join('_');
    const exportContext = project.exports.find(context => context.id === contextId);

    // eslint-disable-next-line react-hooks/immutability -- View accessors delegate to React state setters.
    const generate = useEffectEvent(async (signal: AbortSignal) => {
        // eslint-disable-next-line react-hooks/immutability -- View accessors delegate to React state setters.
        view.error = null;
        setResult({project, selectedIds, settingsRevision, pdf: null, generating: selectedIds.size > 0});
        if (!selectedIds.size) return;
        try {
            const instruments = project.instruments.filter(instrument => selectedIds.has(instrument.id));
            const existing = project.exports.find(context => context.id === contextId);
            const exportContext = project.getOrCreateExportContext(instruments);
            if (!existing) dirtyContexts.current.add(exportContext);
            const signature = JSON.stringify([
                project.title, project.subtitle, project.author, project.authorDate,
                exportContext.withinSystemSpacing, exportContext.betweenSystemSpacing,
                exportContext.isShortcutsVisible,
                instruments.map(instrument => [instrument.id, instrument.title, instrument.shortcut]),
            ]);
            if (save.hasChanges) previews.current = new WeakMap();
            const cached = previews.current.get(exportContext);
            if (!dirtyContexts.current.has(exportContext) && cached?.project === project && cached.signature === signature) {
                setSpacingLimit({project, contextId: exportContext.id, maximum: cached.maximum});
                setResult({project, selectedIds, settingsRevision, pdf: cached.pdf, generating: false});
                return;
            }
            if (!await save.save()) throw new Error('Save the project successfully before exporting.');
            if (signal.aborted) return;
            if (dirtyContexts.current.has(exportContext)) {
                await projectManager.saveProject(project, []);
                dirtyContexts.current.delete(exportContext);
            }
            if (signal.aborted) return;
            let spacingMaximum = 0;
            const pdf = await exportPdfService.createPdf(project, exportContext, maximum => {
                spacingMaximum = maximum;
                if (!signal.aborted) setSpacingLimit({project, contextId: exportContext.id, maximum});
            });
            if (!signal.aborted) {
                previews.current.set(exportContext, {project, signature, pdf, maximum: spacingMaximum});
                setResult({project, selectedIds, settingsRevision, pdf, generating: false});
            }
        } catch (error) {
            if (!signal.aborted) {
                view.error = error instanceof Error ? error.message : 'Unable to generate PDF preview.';
                setResult({project, selectedIds, settingsRevision, pdf: null, generating: false});
            }
        }
    });

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(() => { void generate(controller.signal); }, 250);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [project, selectedIds, settingsRevision]);

    return {
        pdf: current ? result.pdf : null,
        generating: current ? result.generating : selectedIds.size > 0,
        exportContext,
        refresh() {
            previews.current = new WeakMap();
            setSettingsRevision(revision => revision + 1);
        },
        maxSpacing: spacingLimit?.project === project && spacingLimit.contextId === contextId ? spacingLimit.maximum : null,
        setShortcutsVisible(visible: boolean) {
            if (!instruments.length) return;
            const context = project.getOrCreateExportContext(instruments);
            if (context.isShortcutsVisible === visible) return;
            context.isShortcutsVisible = visible;
            dirtyContexts.current.add(context);
            setSettingsRevision(revision => revision + 1);
        },
        setSpacing(setting: 'withinSystemSpacing' | 'betweenSystemSpacing', value: number) {
            if (!instruments.length || !Number.isFinite(value) || value < 0) return;
            const context = project.getOrCreateExportContext(instruments);
            if (context[setting] === value) return;
            context[setting] = value;
            dirtyContexts.current.add(context);
            setSettingsRevision(revision => revision + 1);
        },
    };
}
export type ExportPreviewState = ReturnType<typeof useInitExportPreview>;
