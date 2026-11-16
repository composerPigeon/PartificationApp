/* eslint-disable react-hooks/immutability -- Domain models are mutable; view accessors delegate to React state setters. */
import {useState} from 'react';
import type {Instrument} from '../../../domain';
import {projectManager} from '../../../services';
import {useProject} from '..';
import {useExport} from './useExport';

export function useInstrumentActions() {
    const {project, pages} = useProject();
    const {viewState, instrumentSelection, preview} = useExport();
    const [editing, setEditing] = useState<{instrument: Instrument; position: {top: number; left: number}} | null>(null);
    const [saving, setSaving] = useState(false);

    async function persist() {
        setSaving(true);
        viewState.error = null;
        try {
            await projectManager.saveProject(project, pages);
            preview.refresh();
        } catch (error) {
            viewState.error = error instanceof Error ? error.message : 'Unable to save instrument changes.';
        } finally {
            setSaving(false);
        }
    }

    return {
        editing,
        saving,
        edit(instrument: Instrument, position: {top: number; left: number}) {
            setEditing({instrument, position});
        },
        cancel() { setEditing(null); },
        async submit(title: string, shortcut: string) {
            if (!editing || saving) return;
            editing.instrument.title = title;
            editing.instrument.shortcut = shortcut;
            setEditing(null);
            await persist();
        },
        async deleteInstrument(instrument: Instrument) {
            if (saving || !project.deleteInstrument(instrument.id)) return;
            for (const page of pages) {
                for (const staff of [...page.staves]) {
                    if (staff.instrument.id === instrument.id) page.deleteStaff(staff.id);
                }
            }
            instrumentSelection.select([]);
            viewState.refresh();
            await persist();
        },
    };
}
