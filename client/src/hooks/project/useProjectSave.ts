import {useState} from 'react';
import type {Project, ScorePage} from '../../domain';
import {projectManager} from '../../services';
import {useBaseState} from '..';
import type {ProjectSaveState} from './states';

// Each call owns its saving state; no provider is required.
export function useProjectSave(project: Project, pages: ScorePage[]): ProjectSaveState {
    const base = useBaseState();
    const [saving, setSaving] = useState(false);
    const hasUnsavedPages = () => pages.some(page => page.isChanged);

    async function save(): Promise<boolean> {
        if (saving) return false;
        if (!hasUnsavedPages()) return true;
        setSaving(true);
        // eslint-disable-next-line react-hooks/immutability -- This accessor delegates to React's state setter.
        base.error = null;
        try {
            while (hasUnsavedPages()) await projectManager.saveProject(project, pages);
            return true;
        } catch (error) {
            base.error = error instanceof Error ? error.message : 'Unable to save project.';
            return false;
        } finally {
            setSaving(false);
        }
    }

    return base.extend({
        get saving() { return saving; },
        get hasChanges() { return saving || hasUnsavedPages(); },
        save,
    });
}
