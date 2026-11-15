import {useRef} from 'react';
import {projectManager} from '../../../services';
import type {ViewState} from '../../states';
import type {ProjectSaveState, ProjectState} from '../states';

// Each call owns its saving state; no provider is required.
export function useInitProjectSave(viewState: ViewState, projectState: ProjectState): ProjectSaveState {
    const {project, pages} = projectState;
    const activeSave = useRef<Promise<boolean> | null>(null);
    const hasUnsavedPages = () => pages.some(page => page.isChanged);

    function save(): Promise<boolean> {
        if (activeSave.current) return activeSave.current;
        activeSave.current = performSave().finally(() => {
            activeSave.current = null;
            viewState.refresh();
        });
        viewState.refresh();
        return activeSave.current;
    }

    async function performSave(): Promise<boolean> {
        if (!hasUnsavedPages()) return true;
        // eslint-disable-next-line react-hooks/immutability -- This accessor delegates to React's state setter.
        viewState.error = null;
        try {
            while (hasUnsavedPages()) await projectManager.saveProject(project, pages);
            return true;
        } catch (error) {
            viewState.error = error instanceof Error ? error.message : 'Unable to save project.';
            return false;
        }
    }

    return {
        get error() { return viewState.error; },
        get saving() { return activeSave.current !== null; },
        get hasChanges() { return activeSave.current !== null || hasUnsavedPages(); },
        save,
    };
}
