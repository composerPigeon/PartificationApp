import {useWorkspace} from './useWorkspace';

export function useWorkspaceSave() {
    return useWorkspace().saveState;
}
